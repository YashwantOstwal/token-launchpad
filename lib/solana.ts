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
  Instruction,
  getTransactionCodec,
  setTransactionMessageFeePayerSigner,
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
  ExtensionArgs,
} from "@solana-program/token-2022";
import { Client } from "@/client";
import { FormFields } from "@/components/providers/token-creation-form";
import { maxSize } from "zod";

type CreateMintTransactionMessage = {
  client: Client;
  walletAddress: Address;
  mint: KeyPairSigner<string>;
  decimals: number;
  mintAuthority: string;
  freezeAuthority?: string;
  extensions?: FormFields["extensions"];
};

type TokenMetadataExtension = {
  updateAuthority: string;
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
    extensions?: FormFields["extensions"],
  ) => {
    const instructionsBeforeMintInitialization: Instruction[] = [];
    if (!extensions) return instructionsBeforeMintInitialization;
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

    if (extensions["NonTransferable"]) {
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
      const { rateAuthority, rate } = extensions["InterestBearingConfig"];
      const initializeInterestBearingConfigIxn =
        getInitializeInterestBearingMintInstruction({
          mint: mintAddress,
          rateAuthority: rateAuthority as Address,
          rate,
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
      const { closeAuthority } = extensions["MintCloseAuthority"];

      console.log("from get Ixn", closeAuthority);
      const initializeMintCloseAuthorityIxn =
        getInitializeMintCloseAuthorityInstruction({
          mint: mintAddress,
          closeAuthority: closeAuthority as Address,
        });

      instructionsBeforeMintInitialization.push(
        initializeMintCloseAuthorityIxn,
      );
    }

    if (extensions["GroupPointer"]) {
      const { authority } = extensions["GroupPointer"];
      const initializeGroupPointerIxn = getInitializeGroupPointerInstruction({
        mint: mintAddress,
        groupAddress: mintAddress,
        authority: address(authority),
      });

      instructionsBeforeMintInitialization.push(initializeGroupPointerIxn);
    }

    if (extensions["GroupMemberPointer"]) {
      const { authority } = extensions["GroupMemberPointer"];
      const initializeGroupMemberPointerIxn =
        getInitializeGroupMemberPointerInstruction({
          mint: mintAddress,
          authority: authority as Address,
          memberAddress: mintAddress,
        });

      instructionsBeforeMintInitialization.push(
        initializeGroupMemberPointerIxn,
      );
    }

    return instructionsBeforeMintInitialization;
  };

  const getMintSizeAndRentWithExtensions = async (
    client: Client,
    extensions?: FormFields["extensions"],
  ) => {
    const extensionsForRentCalculation: ExtensionArgs[] = [];
    const extensionsForSpaceCalculation: ExtensionArgs[] = [];
    if (extensions) {
      if (extensions["TokenMetadata"]) {
        const { updateAuthority, uri, name, symbol } =
          extensions["TokenMetadata"];

        const tokenMetadataExtension = extension("TokenMetadata", {
          updateAuthority: address(updateAuthority),
          name,
          uri,
          symbol,
          mint: mintAddress,
          additionalMetadata: new Map(),
        });
        extensionsForRentCalculation.push(tokenMetadataExtension);
        //initialized after mint intiialization. only contributes to rent.
      }

      if (extensions["MetadataPointer"]) {
        const { authority } = extensions["MetadataPointer"];
        const metadataPointerExtension = extension("MetadataPointer", {
          authority: address(authority),
          metadataAddress: mintAddress,
        });

        extensionsForSpaceCalculation.push(metadataPointerExtension);
        extensionsForRentCalculation.push(metadataPointerExtension);
      }

      if (extensions["NonTransferable"]) {
        const NonTransferableMintExtension = extension("NonTransferable", {});
        extensionsForRentCalculation.push(NonTransferableMintExtension);
        extensionsForSpaceCalculation.push(NonTransferableMintExtension);
      }

      if (extensions["PermanentDelegate"]) {
        const { delegate } = extensions["PermanentDelegate"];
        const permanentDelegateExtension = extension("PermanentDelegate", {
          delegate: address(delegate),
        });
        extensionsForRentCalculation.push(permanentDelegateExtension);
        extensionsForSpaceCalculation.push(permanentDelegateExtension);
      }

      if (extensions["TransferFeeConfig"]) {
        const { maximumFee, transferFeeBasisPoints, ...authorities } =
          extensions["TransferFeeConfig"];

        const transferFees: TransferFeeArgs = {
          epoch: 0,
          maximumFee,
          transferFeeBasisPoints,
        };
        const transferFeeConfigExtension = extension("TransferFeeConfig", {
          withdrawWithheldAuthority: address(
            authorities.withdrawWithheldAuthority,
          ),
          transferFeeConfigAuthority: address(
            authorities.transferFeeConfigAuthority,
          ),
          withheldAmount: BigInt(0),
          newerTransferFee: transferFees,
          olderTransferFee: transferFees,
        });

        extensionsForRentCalculation.push(transferFeeConfigExtension);
        extensionsForSpaceCalculation.push(transferFeeConfigExtension);
      }

      if (extensions["InterestBearingConfig"]) {
        let { rate: currentRate, rateAuthority } =
          extensions["InterestBearingConfig"];

        const interestBearingConfigExtension = extension(
          "InterestBearingConfig",
          {
            initializationTimestamp: BigInt(
              Math.floor(new Date().getTime() / 1000),
            ),
            lastUpdateTimestamp: BigInt(
              Math.floor(new Date().getTime() / 1000),
            ),
            preUpdateAverageRate: Math.random(), //giving an idea of the space required.
            currentRate,
            rateAuthority: rateAuthority as Address,
          },
        );

        extensionsForRentCalculation.push(interestBearingConfigExtension);
        extensionsForSpaceCalculation.push(interestBearingConfigExtension);
      }
      if (extensions["DefaultAccountState"]) {
        const { state: index } = extensions["DefaultAccountState"];
        const states = [AccountState.Initialized, AccountState.Frozen];
        const DefaultAccountStateExtension = extension("DefaultAccountState", {
          state: states[Number(index) - 1],
        });

        extensionsForRentCalculation.push(DefaultAccountStateExtension);
        extensionsForSpaceCalculation.push(DefaultAccountStateExtension);
      }

      if (extensions["MintCloseAuthority"]) {
        const { closeAuthority } = extensions["MintCloseAuthority"];

        console.log("space and rent", closeAuthority);
        const mintCloseAuthorityExtension = extension("MintCloseAuthority", {
          closeAuthority: closeAuthority as Address,
        });

        extensionsForRentCalculation.push(mintCloseAuthorityExtension);
        extensionsForSpaceCalculation.push(mintCloseAuthorityExtension);
      }

      if (extensions["GroupPointer"]) {
        const { authority } = extensions["GroupPointer"];

        const groupPointerExtension = extension("GroupPointer", {
          groupAddress: mintAddress,
          authority: address(authority),
        });
        extensionsForRentCalculation.push(groupPointerExtension);
        extensionsForSpaceCalculation.push(groupPointerExtension);
      }
      if (extensions["TokenGroup"]) {
        const { updateAuthority, maxSize } = extensions["TokenGroup"];
        const TokenGroupExtension = extension("TokenGroup", {
          mint: mintAddress,
          updateAuthority: updateAuthority as Address,
          maxSize,
          size: 0,
        });
        extensionsForRentCalculation.push(TokenGroupExtension);
      }

      if (extensions["GroupMemberPointer"]) {
        const { authority } = extensions["GroupMemberPointer"];
        const groupMemberPointerExtension = extension("GroupMemberPointer", {
          memberAddress: mintAddress,
          authority: authority as Address,
        });
        extensionsForRentCalculation.push(groupMemberPointerExtension);
        extensionsForSpaceCalculation.push(groupMemberPointerExtension);
      }
      if (extensions["TokenGroupMember"]) {
        const { group } = extensions["TokenGroupMember"];
        const tokenGroupMemberExtension = extension("TokenGroupMember", {
          mint: mintAddress,
          group: group as Address,
          memberNumber: 0,
        });
        extensionsForRentCalculation.push(tokenGroupMemberExtension);
      }
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

  const selectedWalletSigner = createNoopSigner(walletAddress);

  const createMintAccountIxn = getCreateAccountInstruction({
    newAccount: mint,
    payer: selectedWalletSigner,
    space: mintSpace,
    lamports: mintRent,
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
  });

  const initializeMintIxn = getInitializeMintInstruction({
    mint: mintAddress,
    mintAuthority: address(mintAuthority),
    freezeAuthority: freezeAuthority ? address(freezeAuthority) : null,
    decimals,
  });

  const getInstructionsAfterMintInitialization = (
    extensions?: FormFields["extensions"],
  ) => {
    const instructionsAfterMintInitialization: Instruction[] = [];
    if (!extensions) return instructionsAfterMintInitialization;
    if (extensions["TokenMetadata"]) {
      const { updateAuthority, ...metadata } = extensions["TokenMetadata"];

      const intializeTokenMetadataIxn = getInitializeTokenMetadataInstruction({
        updateAuthority: address(updateAuthority),
        ...metadata,
        mint: mintAddress,
        metadata: mintAddress,
        mintAuthority: selectedWalletSigner,
      });
      instructionsAfterMintInitialization.push(intializeTokenMetadataIxn);
    }

    if (extensions["TokenGroup"]) {
      const { updateAuthority, maxSize } = extensions["TokenGroup"];

      const intializeTokenGroupIxn = getInitializeTokenGroupInstruction({
        group: mintAddress,
        mint: mintAddress,
        mintAuthority: selectedWalletSigner,
        updateAuthority: updateAuthority as Address,
        maxSize,
      });
      instructionsAfterMintInitialization.push(intializeTokenGroupIxn);
    }

    if (extensions["TokenGroupMember"]) {
      const { group } = extensions["TokenGroupMember"];
      const initialiseTokenGroupMemberIxn =
        getInitializeTokenGroupMemberInstruction({
          member: mintAddress,
          memberMint: mintAddress,
          memberMintAuthority: selectedWalletSigner,
          group: group as Address, // References the group mint
          groupUpdateAuthority: selectedWalletSigner,
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
      (tx) => setTransactionMessageFeePayerSigner(selectedWalletSigner, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(ixns, tx),
      // (tx) => client.estimateAndSetComputeUnitLimit(tx)
    );

  const partialSignedTransactionMessage =
    await partiallySignTransactionMessageWithSigners(transactionMessage);

  const encodedTransaction = getBase64EncodedWireTransaction(
    partialSignedTransactionMessage,
  );

  // return getTransactionCodec
  return Buffer.from(encodedTransaction, "base64");
};

export { createMintTransactionMessage, type CreateMintTransactionMessage };
