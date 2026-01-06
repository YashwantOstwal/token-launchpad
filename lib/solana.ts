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
  getInitializeNonTransferableMintInstruction,
  getInitializePermanentDelegateInstruction,
  TransferFeeArgs,
  getInitializeTransferFeeConfigInstruction,
  getInitializeInterestBearingMintInstruction,
  AccountState,
  getInitializeDefaultAccountStateInstruction,
  getInitializeMintCloseAuthorityInstruction,
  getInitializeTokenGroupInstruction,
  getInitializeGroupPointerInstruction,
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

type NonTransferableMintExtension = {};
type MetadataPointerExtension = {
  mintAccountAsMetadataAccount: boolean;
  args: {
    authority: OptionOrNullable<Address>;
    metadataAddress: OptionOrNullable<Address>;
  };
};
type PermanentDelegateExtension = {
  args: {
    delegate: Address;
  };
};

type TransferFeeConfigExtension = {
  args: {
    withdrawWithheldAuthority: Address;
    transferFeeConfigAuthority: Address;
    withheldAmount: bigint;
    newerTransferFee: TransferFeeArgs;
    olderTransferFee: TransferFeeArgs;
  };
};

type InterestBearingConfigExtension = {
  args: {
    rateAuthority: Address;
    initializationTimestamp: bigint;
    lastUpdateTimestamp: bigint;
    preUpdateAverageRate: number;
    currentRate: number;
  };
};
interface DefaultAccountStateExtension {
  args: {
    state: AccountState.Initialized | AccountState.Frozen;
  };
}

interface MintCloseAuthorityExtension {
  args: {
    closeAuthority: Address;
  };
}

interface GroupPointerExtension {
  args: {
    groupAddress: Address;
    authority: Address;
  };
}
interface TokenGroupExtension {
  args: {
    updateAuthority: Address;
    mint: Address;
    size: number;
    maxSize: number;
  };
}

interface TokenGroupMemberExtension {
  member: Address;
  group: Address;
  memberNumber: Address;
}
interface GroupMemberPointerExtension {
  authority: Address;
  memberAddress: Address;
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
    NonTransferableMint: {},
    PermanentDelegate: {
      args: {
        delegate: walletAddress,
      },
    },
    TransferFeeConfig: {
      args: {
        withheldAmount: BigInt(0),
        transferFeeConfigAuthority: walletAddress,
        withdrawWithheldAuthority: walletAddress,
        newerTransferFee: {
          epoch: BigInt(0),
          maximumFee: 2,
          transferFeeBasisPoints: 500,
        },
        olderTransferFee: {
          epoch: BigInt(0),
          maximumFee: 2,
          transferFeeBasisPoints: 500,
        },
      },
    },
    InterestBearingConfig: {
      args: {
        rateAuthority: walletAddress,
        initializationTimestamp: BigInt(
          Math.floor(new Date().getTime() / 1000)
        ),
        lastUpdateTimestamp: BigInt(Math.floor(new Date().getTime() / 1000)),
        preUpdateAverageRate: 500,
        currentRate: 500,
      },
    },
    DefaultAccountState: {
      args: {
        state: AccountState.Frozen,
      },
    },
    MintCloseAuthority: {
      args: {
        closeAuthority: walletAddress,
      },
    },
    GroupPointer: {
      args: {
        authority: walletAddress,
        groupAddress: mintAddress,
      },
    },
    TokenGroup: {
      args: {
        updateAuthority: walletAddress,
        mint: mintAddress,
        size: 3,
        maxSize: 10,
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

    if (extensions["NonTransferableMint"]) {
      const initializeNonTransferableMintIxn =
        getInitializeNonTransferableMintInstruction({
          mint: mintAddress,
        });
      instructionsBeforeMintInitialization.push(
        initializeNonTransferableMintIxn
      );
    }

    if (extensions["PermanentDelegate"]) {
      const initializePermanentDelegateIxn =
        getInitializePermanentDelegateInstruction({
          mint: mintAddress,
          ...extensions["PermanentDelegate"].args,
        });
      instructionsBeforeMintInitialization.push(initializePermanentDelegateIxn);
    }

    if (extensions["TransferFeeConfig"]) {
      const {
        transferFeeConfigAuthority,
        withdrawWithheldAuthority,
        newerTransferFee,
      } = extensions["TransferFeeConfig"].args;
      const initializeTransferFeeConfigExtensionIxn =
        getInitializeTransferFeeConfigInstruction({
          mint: mintAddress,
          transferFeeConfigAuthority,
          withdrawWithheldAuthority,
          ...newerTransferFee,
        });

      instructionsBeforeMintInitialization.push(
        initializeTransferFeeConfigExtensionIxn
      );
    }

    if (extensions["InterestBearingConfig"]) {
      const { currentRate: rate, rateAuthority } =
        extensions["InterestBearingConfig"].args;
      const initializeInterestBearingConfigIxn =
        getInitializeInterestBearingMintInstruction({
          rate,
          rateAuthority,
          mint: mintAddress,
        });
      instructionsBeforeMintInitialization.push(
        initializeInterestBearingConfigIxn
      );
    }

    if (extensions["DefaultAccountState"]) {
      const initializeDefaultAccountStateIxn =
        getInitializeDefaultAccountStateInstruction({
          mint: mintAddress,
          ...extensions["DefaultAccountState"].args,
        });

      instructionsBeforeMintInitialization.push(
        initializeDefaultAccountStateIxn
      );
    }

    if (extensions["MintCloseAuthority"]) {
      const initializeMintCloseAuthorityIxn =
        getInitializeMintCloseAuthorityInstruction({
          mint: mintAddress,
          ...extensions["MintCloseAuthority"].args,
        });

      instructionsBeforeMintInitialization.push(
        initializeMintCloseAuthorityIxn
      );
    }

    if (extensions["MintCloseAuthority"]) {
      const initializeMintCloseAuthorityIxn =
        getInitializeMintCloseAuthorityInstruction({
          mint: mintAddress,
          ...extensions["MintCloseAuthority"].args,
        });

      instructionsBeforeMintInitialization.push(
        initializeMintCloseAuthorityIxn
      );
    }

    if (extensions["GroupPointer"]) {
      const initializeGroupPointerIxn = getInitializeGroupPointerInstruction({
        mint: mintAddress,
        ...extensions["GroupPointer"].args,
      });

      instructionsBeforeMintInitialization.push(initializeGroupPointerIxn);
    }
    return instructionsBeforeMintInitialization;
  };

  const getMintSizeAndRentWithExtensions = async (
    client: Client,
    extensionArgs?: MintExtensions
  ) => {
    const extensionsForRentCalculation = [];
    const extensionsForSpaceCalculation = [];
    if (extensionArgs?.["TokenMetadata"]) {
      const tokenMetadataExtension = extension(
        "TokenMetadata",
        extensionArgs["TokenMetadata"].args
      );
      extensionsForRentCalculation.push(tokenMetadataExtension);
      //initialized after mint intiialization. only contributes to rent.
    }

    if (extensionArgs?.["MetadataPointer"]) {
      const metadataPointerExtension = extension(
        "MetadataPointer",
        extensionArgs["MetadataPointer"].args
      );

      extensionsForSpaceCalculation.push(metadataPointerExtension);
      extensionsForRentCalculation.push(metadataPointerExtension);
    }

    if (extensionArgs?.["NonTransferableMint"]) {
      const NonTransferableMintExtension = extension("NonTransferable", {});
      extensionsForRentCalculation.push(NonTransferableMintExtension);
      extensionsForSpaceCalculation.push(NonTransferableMintExtension);
    }

    if (extensionArgs?.["PermanentDelegate"]) {
      const permanentDelegateExtension = extension("PermanentDelegate", {
        ...extensionArgs["PermanentDelegate"].args,
      });
      extensionsForRentCalculation.push(permanentDelegateExtension);
      extensionsForSpaceCalculation.push(permanentDelegateExtension);
    }

    if (extensionArgs?.["TransferFeeConfig"]) {
      const transferFeeConfigExtension = extension(
        "TransferFeeConfig",
        extensionArgs["TransferFeeConfig"].args
      );

      extensionsForRentCalculation.push(transferFeeConfigExtension);
      extensionsForSpaceCalculation.push(transferFeeConfigExtension);
    }

    if (extensionArgs?.["InterestBearingConfig"]) {
      const interestBearingConfigExtension = extension(
        "InterestBearingConfig",
        extensionArgs["InterestBearingConfig"].args
      );

      extensionsForRentCalculation.push(interestBearingConfigExtension);
      extensionsForSpaceCalculation.push(interestBearingConfigExtension);
    }
    if (extensionArgs?.["DefaultAccountState"]) {
      const DefaultAccountStateExtension = extension(
        "DefaultAccountState",
        extensionArgs["DefaultAccountState"].args
      );

      extensionsForRentCalculation.push(DefaultAccountStateExtension);
      extensionsForSpaceCalculation.push(DefaultAccountStateExtension);
    }

    if (extensionArgs?.["MintCloseAuthority"]) {
      const mintCloseAuthorityExtension = extension(
        "MintCloseAuthority",
        extensionArgs["MintCloseAuthority"].args
      );

      extensionsForRentCalculation.push(mintCloseAuthorityExtension);
      extensionsForSpaceCalculation.push(mintCloseAuthorityExtension);
    }

    if (extensionArgs?.["GroupPointer"]) {
      const groupPointerExtension = extension(
        "GroupPointer",
        extensionArgs["GroupPointer"].args
      );
      extensionsForRentCalculation.push(groupPointerExtension);
      extensionsForSpaceCalculation.push(groupPointerExtension);
    }
    if (extensionArgs?.["TokenGroup"]) {
      const TokenGroupExtension = extension(
        "TokenGroup",
        extensionArgs["TokenGroup"].args
      );
      extensionsForRentCalculation.push(TokenGroupExtension);
    }

    if (extensionArgs?.[""])
      const mintSpace =
        extensionsForSpaceCalculation.length > 0
          ? getMintSize(extensionsForSpaceCalculation)
          : getMintSize();

    const mintRent = await client.rpc
      .getMinimumBalanceForRentExemption(
        BigInt(
          extensionsForRentCalculation.length > 0
            ? getMintSize(extensionsForRentCalculation)
            : getMintSize()
        )
      )
      .send();

    return { mintSpace, mintRent };
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
      const intializeTokenMetadataIxn = getInitializeTokenMetadataInstruction({
        ...extensions["TokenMetadata"].args,
        metadata: mintAddress,
        mintAuthority: walletSigner,
      });
      instructionsAfterMintInitialization.push(intializeTokenMetadataIxn);
    }

    if (extensions["TokenGroup"]) {
      const { size, ...rest } = extensions["TokenGroup"].args;
      const intializeTokenGroupIxn = getInitializeTokenGroupInstruction({
        group: rest.mint,
        mintAuthority: walletSigner,
        ...rest,
      });
      instructionsAfterMintInitialization.push(intializeTokenGroupIxn);
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
