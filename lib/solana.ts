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
} from "@solana/kit";
import {
  extension,
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
  getInitializeMetadataPointerInstruction,
  getInitializeTokenMetadataInstruction,
  getInitializeNonTransferableMintInstruction,
  getInitializePermanentDelegateInstruction,
  TransferFeeArgs,
  getInitializeTransferFeeConfigInstruction,
  getInitializeInterestBearingMintInstruction,
  AccountState,
  getInitializeDefaultAccountStateInstruction,
  getInitializeMintCloseAuthorityInstruction,
  getInitializeGroupMemberPointerInstruction,
  getInitializeTokenGroupInstruction,
  getInitializeGroupPointerInstruction,
  getInitializeTokenGroupMemberInstruction,
} from "@solana-program/token-2022";
import { Client } from "@/client";

type CreateMintTransactionMessage = {
  client: Client;
  walletAddress: Address;
  mint: KeyPairSigner<string>;
  decimals: number;
  mintAuthority: string;
  freezeAuthority?: string;
  extensions: MintExtensions;
};

type TokenMetadataExtension = {
  updateAuthority: string;
  // mint: Address;
  name: string;
  symbol: string;
  uri: string;
};

type NonTransferableMintExtension = {};
type MetadataPointerExtension = {
  authority: string;
};
type PermanentDelegateExtension = {
  delegate: string;
};

type TransferFeeConfigExtension = {
  withdrawWithheldAuthority: string;
  transferFeeConfigAuthority: string;
  maximumFee: number | bigint;
  transferFeeBasisPoints: number;
};

type InterestBearingConfigExtension = {
  rateAuthority: Address;
  rate: number;
};
interface DefaultAccountStateExtension {
  //"1"-> intialised
  // "2" -> Frozen
  state: "1" | "2";
}

interface MintCloseAuthorityExtension {
  closeAuthority: string;
}

interface GroupPointerExtension {
  authority: string;
}
interface TokenGroupExtension {
  updateAuthority: Address;
  maxSize: number;
}

interface TokenGroupMemberExtension {
  args: {
    mint: Address;
    group: Address;
    memberNumber: number;
  };
}
interface GroupMemberPointerExtension {
  args: {
    authority: Address;
    memberAddress: Address;
  };
}

interface MintExtensions {
  TokenMetadata?: TokenMetadataExtension;
  MetadataPointer?: MetadataPointerExtension;
  NonTransferableMint?: NonTransferableMintExtension;
  PermanentDelegate?: PermanentDelegateExtension;
  TransferFeeConfig?: TransferFeeConfigExtension;
  InterestBearingConfig?: InterestBearingConfigExtension;
  DefaultAccountState?: DefaultAccountStateExtension;
  MintCloseAuthority?: MintCloseAuthorityExtension;
  TokenGroup?: TokenGroupExtension;
  GroupPointer?: GroupPointerExtension;
  GroupMemberPointer?: GroupMemberPointerExtension;
  TokenGroupMember?: TokenGroupMemberExtension;
}

const createMintTransactionMessage = async ({
  client,
  walletAddress,
  mint,
  decimals,
  mintAuthority,
  freezeAuthority,
  extensions,
}: CreateMintTransactionMessage) => {
  const mintAddress = mint.address;

  const getInstructionsBeforeMintInitialization = (
    extensions: MintExtensions,
  ) => {
    const instructionsBeforeMintInitialization = [];
    if (extensions["MetadataPointer"]) {
      const { authority } = extensions["MetadataPointer"];
      const initializeMetadataPointerIxn =
        getInitializeMetadataPointerInstruction({
          authority: address(authority),
          metadataAddress: mintAddress, //can point to an external metadata account.
          mint: mintAddress,
        });
      instructionsBeforeMintInitialization.push(initializeMetadataPointerIxn);
    }

    if (extensions["NonTransferableMint"]) {
      const initializeNonTransferableMintIxn =
        getInitializeNonTransferableMintInstruction({
          mint: mintAddress,
        });
      instructionsBeforeMintInitialization.push(
        initializeNonTransferableMintIxn,
      );
    }

    if (extensions["PermanentDelegate"]) {
      const { delegate } = extensions["PermanentDelegate"];
      const initializePermanentDelegateIxn =
        getInitializePermanentDelegateInstruction({
          mint: mintAddress,
          delegate: address(delegate),
        });
      instructionsBeforeMintInitialization.push(initializePermanentDelegateIxn);
    }

    if (extensions["TransferFeeConfig"]) {
      const { transferFeeConfigAuthority, withdrawWithheldAuthority, ...rest } =
        extensions["TransferFeeConfig"];
      const initializeTransferFeeConfigExtensionIxn =
        getInitializeTransferFeeConfigInstruction({
          mint: mintAddress,
          transferFeeConfigAuthority: address(transferFeeConfigAuthority),
          withdrawWithheldAuthority: address(withdrawWithheldAuthority),
          ...rest,
        });

      instructionsBeforeMintInitialization.push(
        initializeTransferFeeConfigExtensionIxn,
      );
    }

    if (extensions["InterestBearingConfig"]) {
      const initializeInterestBearingConfigIxn =
        getInitializeInterestBearingMintInstruction({
          mint: mintAddress,
          ...extensions["InterestBearingConfig"],
        });
      instructionsBeforeMintInitialization.push(
        initializeInterestBearingConfigIxn,
      );
    }

    if (extensions["DefaultAccountState"]) {
      const { state: index } = extensions["DefaultAccountState"];
      const states = [AccountState.Initialized, AccountState.Frozen];

      const initializeDefaultAccountStateIxn =
        getInitializeDefaultAccountStateInstruction({
          mint: mintAddress,
          state: states[Number(index) - 1],
        });

      instructionsBeforeMintInitialization.push(
        initializeDefaultAccountStateIxn,
      );
    }

    if (extensions["MintCloseAuthority"]) {
      const initializeMintCloseAuthorityIxn =
        getInitializeMintCloseAuthorityInstruction({
          mint: mintAddress,
          ...extensions["MintCloseAuthority"],
        });

      instructionsBeforeMintInitialization.push(
        initializeMintCloseAuthorityIxn,
      );
    }

    if (extensions["GroupPointer"]) {
      const initializeGroupPointerIxn = getInitializeGroupPointerInstruction({
        mint: mintAddress,
        groupAddress: mintAddress,

        ...extensions["GroupPointer"],
      });

      instructionsBeforeMintInitialization.push(initializeGroupPointerIxn);
    }

    if (extensions["GroupMemberPointer"]) {
      const initializeGroupMemberPointerIxn =
        getInitializeGroupMemberPointerInstruction({
          mint: mintAddress,
          ...extensions["GroupMemberPointer"].args,
        });

      instructionsBeforeMintInitialization.push(
        initializeGroupMemberPointerIxn,
      );
    }

    return instructionsBeforeMintInitialization;
  };

  const getMintSizeAndRentWithExtensions = async (
    client: Client,
    extensions?: MintExtensions,
  ) => {
    const extensionsForRentCalculation = [];
    const extensionsForSpaceCalculation = [];
    if (extensions?.["TokenMetadata"]) {
      const tokenMetadataExtension = extension("TokenMetadata", {
        ...extensions["TokenMetadata"],
        mint: mintAddress,
        additionalMetadata: new Map(),
      });
      extensionsForRentCalculation.push(tokenMetadataExtension);
      //initialized after mint intiialization. only contributes to rent.
    }

    if (extensions?.["MetadataPointer"]) {
      const metadataPointerExtension = extension(
        "MetadataPointer",
        { ...extensions["MetadataPointer"], metadataAddress: mintAddress }, //can point to an external metadata account.
      );

      extensionsForSpaceCalculation.push(metadataPointerExtension);
      extensionsForRentCalculation.push(metadataPointerExtension);
    }

    if (extensions?.["NonTransferableMint"]) {
      const NonTransferableMintExtension = extension("NonTransferable", {});
      extensionsForRentCalculation.push(NonTransferableMintExtension);
      extensionsForSpaceCalculation.push(NonTransferableMintExtension);
    }

    if (extensions?.["PermanentDelegate"]) {
      const permanentDelegateExtension = extension("PermanentDelegate", {
        ...extensions["PermanentDelegate"],
      });
      extensionsForRentCalculation.push(permanentDelegateExtension);
      extensionsForSpaceCalculation.push(permanentDelegateExtension);
    }

    if (extensions?.["TransferFeeConfig"]) {
      const { maximumFee, transferFeeBasisPoints, ...authorities } =
        extensions["TransferFeeConfig"];

      const transferFees: TransferFeeArgs = {
        epoch: 0,
        maximumFee,
        transferFeeBasisPoints,
      };
      const transferFeeConfigExtension = extension("TransferFeeConfig", {
        ...authorities,
        withheldAmount: BigInt(0),
        newerTransferFee: transferFees,
        olderTransferFee: transferFees,
      });

      extensionsForRentCalculation.push(transferFeeConfigExtension);
      extensionsForSpaceCalculation.push(transferFeeConfigExtension);
    }

    if (extensions?.["InterestBearingConfig"]) {
      let { rate: currentRate, rateAuthority } =
        extensions["InterestBearingConfig"];
      const interestBearingConfigExtension = extension(
        "InterestBearingConfig",
        {
          initializationTimestamp: BigInt(
            Math.floor(new Date().getTime() / 1000),
          ),
          lastUpdateTimestamp: BigInt(Math.floor(new Date().getTime() / 1000)),
          preUpdateAverageRate: Math.random(), //giving an idea of the space required.
          currentRate,
          rateAuthority,
        },
      );

      extensionsForRentCalculation.push(interestBearingConfigExtension);
      extensionsForSpaceCalculation.push(interestBearingConfigExtension);
    }
    if (extensions?.["DefaultAccountState"]) {
      const { state: index } = extensions["DefaultAccountState"];
      const states = [AccountState.Initialized, AccountState.Frozen];
      const DefaultAccountStateExtension = extension("DefaultAccountState", {
        state: states[Number(index) - 1],
      });

      extensionsForRentCalculation.push(DefaultAccountStateExtension);
      extensionsForSpaceCalculation.push(DefaultAccountStateExtension);
    }

    if (extensions?.["MintCloseAuthority"]) {
      const mintCloseAuthorityExtension = extension(
        "MintCloseAuthority",
        extensions["MintCloseAuthority"],
      );

      extensionsForRentCalculation.push(mintCloseAuthorityExtension);
      extensionsForSpaceCalculation.push(mintCloseAuthorityExtension);
    }

    if (extensions?.["GroupPointer"]) {
      const groupPointerExtension = extension("GroupPointer", {
        groupAddress: mintAddress,
        ...extensions["GroupPointer"],
      });
      extensionsForRentCalculation.push(groupPointerExtension);
      extensionsForSpaceCalculation.push(groupPointerExtension);
    }
    if (extensions?.["TokenGroup"]) {
      const TokenGroupExtension = extension("TokenGroup", {
        mint: mintAddress,
        size: 3,
        ...extensions["TokenGroup"],
      });
      extensionsForRentCalculation.push(TokenGroupExtension);
    }

    if (extensions?.["GroupMemberPointer"]) {
      const groupMemberPointerExtension = extension(
        "GroupMemberPointer",
        extensions["GroupMemberPointer"].args,
      );
      extensionsForRentCalculation.push(groupMemberPointerExtension);
      extensionsForSpaceCalculation.push(groupMemberPointerExtension);
    }
    if (extensions?.["TokenGroupMember"]) {
      const tokenGroupMemberExtension = extension(
        "TokenGroupMember",
        extensions["TokenGroupMember"].args,
      );
      extensionsForRentCalculation.push(tokenGroupMemberExtension);
    }

    const mintSpace =
      extensionsForSpaceCalculation.length > 0
        ? getMintSize(extensionsForSpaceCalculation)
        : getMintSize();

    const mintRent = await client.rpc
      .getMinimumBalanceForRentExemption(
        BigInt(
          extensionsForRentCalculation.length > 0
            ? getMintSize(extensionsForRentCalculation)
            : getMintSize(),
        ),
      )
      .send();

    return { mintSpace, mintRent };
  };
  const { mintSpace, mintRent } = await getMintSizeAndRentWithExtensions(
    client,
    extensions,
  );
  const [{ value: latestBlockhash }] = await Promise.all([
    client.rpc.getLatestBlockhash().send(),
  ]);

  const walletSigner = createNoopSigner(walletAddress);
  const createMintAccountIxn = getCreateAccountInstruction({
    newAccount: mint,
    payer: walletSigner,
    space: mintSpace,
    lamports: mintRent,
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
  });

  const initializeMintIxn = getInitializeMintInstruction({
    mint: mintAddress,
    mintAuthority,
    freezeAuthority: freezeAuthority ?? null,
    decimals,
  });

  const getInstructionsAfterMintInitialization = (
    extensions: MintExtensions,
  ) => {
    const instructionsAfterMintInitialization = [];
    if (extensions["TokenMetadata"]) {
      const intializeTokenMetadataIxn = getInitializeTokenMetadataInstruction({
        ...extensions["TokenMetadata"],
        mint: mintAddress,
        metadata: mintAddress,
        mintAuthority: walletSigner,
      });
      instructionsAfterMintInitialization.push(intializeTokenMetadataIxn);
    }

    if (extensions["TokenGroup"]) {
      const intializeTokenGroupIxn = getInitializeTokenGroupInstruction({
        group: mintAddress,
        mint: mintAddress,
        mintAuthority: walletSigner,
        ...extensions["TokenGroup"],
      });
      instructionsAfterMintInitialization.push(intializeTokenGroupIxn);
    }

    if (extensions["TokenGroupMember"]) {
      const { group, mint: memberMint } = extensions["TokenGroupMember"].args;
      const initialiseTokenGroupMemberIxn =
        getInitializeTokenGroupMemberInstruction({
          member: mintAddress,
          memberMint,
          memberMintAuthority: walletSigner,
          group: group, // References the group mint
          groupUpdateAuthority: walletSigner,
        });
      instructionsAfterMintInitialization.push(initialiseTokenGroupMemberIxn);
    }
    return instructionsAfterMintInitialization;
  };

  const ixns = [
    createMintAccountIxn,
    ...getInstructionsBeforeMintInitialization(extensions),
    initializeMintIxn,
    ...getInstructionsAfterMintInitialization(extensions),
  ];
  const transactionMessage =
    // await
    pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayer(address(walletAddress), tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(ixns, tx),
      // (tx) => client.estimateAndSetComputeUnitLimit(tx)
    );

  const partialSignedTransactionMessage =
    await partiallySignTransactionMessageWithSigners(transactionMessage);

  const encodedTransaction = getBase64EncodedWireTransaction(
    partialSignedTransactionMessage,
  );

  return Buffer.from(encodedTransaction, "base64");
};

export { createMintTransactionMessage, type CreateMintTransactionMessage };
