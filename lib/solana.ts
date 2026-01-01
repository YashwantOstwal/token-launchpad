import { getCreateAccountInstruction } from "@solana-program/system";
import {
  address,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  createNoopSigner,
  partiallySignTransactionMessageWithSigners,
  Address,
  getBase64EncodedWireTransaction,
  KeyPairSigner,
  OptionOrNullable,
} from "@solana/kit";
import {
  extension,
  type Extension,
  getInitializeMintInstruction,
  type InitializeMintInput,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
  getInitializeMetadataPointerInstruction,
  getInitializeTokenMetadataInstruction,
} from "@solana-program/token-2022";
import { Client } from "@/client";

type CreateMintTransactionMessage = Omit<
  Omit<InitializeMintInput, "mint">,
  "mintAuthority"
> & {
  client: Client;
  walletAddress: Address;
  isFreezeAuthority: boolean;
  mintKeyPairSigner: KeyPairSigner<string>;
};

type TokenMetadataExtension = {
  mintAccountAsMetadataAccount: boolean;
  args: {
    updateAuthority: Address;
    mint: Address;
    name: string;
    symbol: string;
    uri: string;
    additionalMetadata: Map<string, string>;
  };
};

type MetadataPointerExtension = {
  mintAccountAsMetadataAccount: boolean;
  args: {
    authority: OptionOrNullable<Address>;
    metadataAddress: OptionOrNullable<Address>;
  };
};
type MintExtensions = {
  TokenMetadata?: TokenMetadataExtension;
  MetadataPointer?: MetadataPointerExtension;
};

const getMintSizeAndRentWithExtensions = async (
  client: Client,
  extensionArgs?: MintExtensions
) => {
  const extensionsForRentCaluculation = [];
  const extensionsForSpaceCalculation = [];
  if (extensionArgs?.["TokenMetadata"]) {
    const tokenMetadataExtension = extension(
      "TokenMetadata",
      extensionArgs["TokenMetadata"].args
    );
    extensionsForRentCaluculation.push(tokenMetadataExtension);
    //initialized after mint intiialization. only contributes to rent.
  }

  if (extensionArgs?.["MetadataPointer"]) {
    const metadataPointerExtension = extension(
      "MetadataPointer",
      extensionArgs["MetadataPointer"].args
    );

    extensionsForSpaceCalculation.push(metadataPointerExtension);
    extensionsForRentCaluculation.push(metadataPointerExtension);
  }

  const mintSpace =
    extensionsForSpaceCalculation.length > 0
      ? getMintSize(extensionsForSpaceCalculation)
      : getMintSize();

  const mintRent = await client.rpc
    .getMinimumBalanceForRentExemption(
      BigInt(
        extensionsForRentCaluculation.length > 0
          ? getMintSize(extensionsForRentCaluculation)
          : getMintSize()
      )
    )
    .send();
  return { mintSpace, mintRent };
};

const createMintTransactionMessage = async (
  inputs: CreateMintTransactionMessage
) => {
  const { client, walletAddress, mintKeyPairSigner, ...rest } = inputs;
  const {
    decimals,
    isFreezeAuthority,
    // ...mintExtensions
  } = rest;

  const mintAddress = mintKeyPairSigner.address;

  const mintExtensions: MintExtensions = {
    TokenMetadata: {
      mintAccountAsMetadataAccount: false,
      args: {
        updateAuthority: walletAddress,
        mint: mintAddress,
        name: "Yash",
        symbol: "Ostwal",
        uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
        additionalMetadata: new Map(),
      },
    },
    MetadataPointer: {
      mintAccountAsMetadataAccount: false,
      args: {
        metadataAddress: mintAddress, //can point to an external metadata account.
        authority: walletAddress,
      },
    },
  };

  const getInstructionsBeforeMintInitialization = (
    extensions: MintExtensions
  ) => {
    const instructionsBeforeMintInitialization = [];
    if (extensions["MetadataPointer"]) {
      const initializeMetadataPointerIxn =
        getInitializeMetadataPointerInstruction({
          ...extensions["MetadataPointer"].args,
          mint: mintAddress,
        });
      instructionsBeforeMintInitialization.push(initializeMetadataPointerIxn);
    }
    return instructionsBeforeMintInitialization;
  };
  const { mintSpace, mintRent } = await getMintSizeAndRentWithExtensions(
    client,
    mintExtensions
  );
  const [{ value: latestBlockhash }] = await Promise.all([
    client.rpc.getLatestBlockhash().send(),
  ]);

  const walletSigner = createNoopSigner(walletAddress);
  const createMintAccountIxn = getCreateAccountInstruction({
    newAccount: mintKeyPairSigner,
    payer: walletSigner,
    space: mintSpace,
    lamports: mintRent,
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
  });

  const initializeMintIxn = getInitializeMintInstruction({
    mint: mintAddress,
    mintAuthority: walletAddress,
    freezeAuthority: isFreezeAuthority ? walletAddress : null,
    decimals,
  });

  const getInstructionsAfterMintInitialization = (
    extensions: MintExtensions
  ) => {
    const instructionsAfterMintInitialization = [];
    if (extensions["TokenMetadata"]) {
      const intializeTokenMetadataExtension =
        getInitializeTokenMetadataInstruction({
          ...extensions["TokenMetadata"].args,
          metadata: mintAddress,
          mintAuthority: walletSigner,
        });
      instructionsAfterMintInitialization.push(intializeTokenMetadataExtension);
    }
    return instructionsAfterMintInitialization;
  };

  const ixns = [
    createMintAccountIxn,
    ...getInstructionsBeforeMintInitialization(mintExtensions),
    initializeMintIxn,
    ...getInstructionsAfterMintInitialization(mintExtensions),
  ];
  const transactionMessage = await pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(address(walletAddress), tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(ixns, tx),
    (tx) => client.estimateAndSetComputeUnitLimit(tx)
  );

  const partialSignedTransactionMessage =
    await partiallySignTransactionMessageWithSigners(transactionMessage);

  const encodedTransaction = getBase64EncodedWireTransaction(
    partialSignedTransactionMessage
  );

  return Buffer.from(encodedTransaction, "base64");
};

export { createMintTransactionMessage, type CreateMintTransactionMessage };
