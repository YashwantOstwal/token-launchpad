"use client";

import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";
import { address, type KeyPairSigner } from "@solana/kit";
import bs58 from "bs58";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/client";
import { createMintTransactionMessage } from "@/lib/solana";
import { useSolanaWallet } from "@/components/providers/solana-wallet-provider";
import { useGenerateKeyPairSigner } from "@/hooks/use-generate-mint";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useMintCreationForm } from "@/components/providers/token-creation-form";
import { BaseForm } from "@/components/base-form";
import { MintAddress } from "@/components/mint-address";
import { MintCloseAuthority } from "@/components/extensions/mint-close-authority";
import { TokenMetadata } from "@/components/extensions/token-metadata";
import { TransferFeeConfig } from "@/components/extensions/transfer-fee-config";
import { InterestBearingTokens } from "@/components/extensions/interest-bearing-tokens";
import { DefaultAccountState } from "@/components/extensions/default-account-state";
import { NonTransferable } from "@/components/extensions/non-transferable";
import { TokenGroup } from "@/components/extensions/token-group";
import { GroupPointer } from "@/components/extensions/group-pointer";
import { MetadataPointer } from "@/components/extensions/metadata-pointer";
import { PermanentDelegate } from "@/components/extensions/permanent-delegate";

/* 
Todo:
creating a mint with them.
save draft in local storage.
update the url params with inputs updating it on mount logic.

maximum fee validation with .superRefine();
disclaimer: tokenMetadata, groupMint, memberMint extension requires signing from mintAuthority, so recommned you to set this field to the walletAddress so you can sign the transaction.

disclaimer: Default state extension requires Freeze Authority, Mandatory if you want to 
enable default state extension.
*/
export default function Home() {
  const [client] = useState(createClient);
  const [allExtensions] = useState({
    mintCloseAuthority: <MintCloseAuthority />,
    defaultAccountState: <DefaultAccountState />,
    groupPointer: <GroupPointer />,
    interestBearingTokens: <InterestBearingTokens />,
    metadataPointer: <MetadataPointer />,
    nonTransferable: <NonTransferable />,
    PermanentDelegate: <PermanentDelegate />,
    tokenGroup: <TokenGroup />,
    tokenMetadata: <TokenMetadata />,
    transferFeeConfig: <TransferFeeConfig />,
  });

  const [mint, generateNewMint] = useGenerateKeyPairSigner();
  const { wallet, ready } = useSolanaWallet();
  const { handleSubmit } = useMintCreationForm();
  const [enabledExtensions, setEnabledExtensions] = useState<
    Record<keyof typeof allExtensions, boolean>
  >({
    mintCloseAuthority: false,
    defaultAccountState: false,
    groupPointer: false,
    interestBearingTokens: false,
    metadataPointer: false,
    nonTransferable: false,
    PermanentDelegate: false,
    tokenGroup: false,
    tokenMetadata: false,
    transferFeeConfig: false,
  });

  const onSubmit = handleSubmit(async (data) => {
    if (mint == null) return;
    // const mintExtensions: MintExtensions = {
    //   TokenMetadata: {
    //     updateAuthority: walletAddress,
    //     name: "Yash",
    //     symbol: "Ostwal",
    //     uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
    //   },
    //   MetadataPointer: {
    //     authority: walletAddress,
    //   },
    //   NonTransferableMint: {},
    //   PermanentDelegate: {
    //     delegate: walletAddress,
    //   },
    //   TransferFeeConfig: {
    //     transferFeeConfigAuthority: walletAddress,
    //     withdrawWithheldAuthority: walletAddress,
    //     transferFeeBasisPoints: 500,
    //     maximumFee: 2,
    //   },
    //   InterestBearingConfig: {
    //     rateAuthority: walletAddress,
    //     rate: 500,
    //   },
    //   DefaultAccountState: {
    //     state: "1",
    //   },
    //   MintCloseAuthority: {
    //     closeAuthority: walletAddress,
    //   },
    //   GroupPointer: {
    //     authority: walletAddress,
    //   },
    //   TokenGroup: {
    //     updateAuthority: walletAddress,
    //     maxSize: 10,
    //   },
    //   GroupMemberPointer: {
    //     args: {
    //       authority: walletAddress,
    //       memberAddress: mintAddress,
    //     },
    //   },
    //   TokenGroupMember: {
    //     args: {
    //       memberNumber: 1,
    //       group: address("AUFGgoM3V4L61M7XLwZPDdtgcm8dLyyDS6yKATBxhsDb"),
    //       mint: mintAddress,
    //     },
    //   },
    // };

    console.log({ data });
    const walletAddress = address(wallet.address);
    const transaction = await createMintTransactionMessage({
      client,
      walletAddress,
      mint,
      ...data,
    });
    try {
      const { signature } = await signAndSendTransaction({
        transaction,
        wallet,
      });
      setTransactionSignature(bs58.encode(signature));
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="pt-20 font-inter max-w-2xl min-h-screen bg-background text-foreground"
    >
      <MintAddress
        mintAddress={mint?.address}
        generateNewMint={generateNewMint}
      />
      <BaseForm />
      <div className="flex flex-wrap gap-2">
        {Object.keys(allExtensions).map((extension) => (
          <div className="flex gap-0.5 items-center">
            <button
              type="button"
              onClick={() =>
                setEnabledExtensions((prev) => ({ ...prev, [extension]: true }))
              }
            >
              {extension}
            </button>
            <button
              type="button"
              onClick={() => {
                setEnabledExtensions((prev) => ({
                  ...prev,
                  [extension]: false,
                }));
              }}
              className="bg-red-300 p-0.5"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div className="p-5">
        {Object.entries(enabledExtensions)
          .filter(([_, value]) => value)
          .map(([key]) => allExtensions[key as keyof typeof allExtensions])}
      </div>
      <button
        type="submit"
        className={cn("border p-1 disabled:opacity-50")}
        disabled={!ready || !wallet || mint === null}
      >
        Click to creat mint.
      </button>
    </form>
  );
}
