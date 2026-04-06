"use client";

import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";
import {
  Address,
  address,
  getBase58Decoder,
  getBase58Encoder,
  isSolanaError,
  type KeyPairSigner,
} from "@solana/kit";
import bs58 from "bs58";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/client";
import { createMintTransactionMessage } from "@/lib/solana";
import { useGenerateKeyPairSigner } from "@/hooks/use-generate-mint";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useMintCreationForm } from "@/components/providers/token-creation-form";
import { BaseForm } from "@/components/base-form";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";

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
import { FieldGroup, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RefreshCwIcon } from "lucide-react";
import { usePrivyAsSolanaWallet } from "@/components/providers/privy-as-solana-wallet";
import { Button } from "@/components/ui/button";
import { useSolanaClient } from "@/components/providers/solana-client";
import { ButtonGroup } from "@/components/ui/button-group";
import { XIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GroupMemberPointer } from "@/components/extensions/group-member-pointer";
import { TokenGroupMember } from "@/components/extensions/token-group-member";
import { Badge } from "@/components/ui/badge";
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
  const client = useSolanaClient();
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
    groupMemberPointer: <GroupMemberPointer />,
    tokenGroupMember: <TokenGroupMember />,
  });

  const [mint, generateNewMint] = useGenerateKeyPairSigner();
  const { ready, selectedWallet, signAndSendTransaction } =
    usePrivyAsSolanaWallet();
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
    groupMemberPointer: false,
    tokenGroupMember: false,
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!mint || !selectedWallet || !ready) return;
    console.log(data);

    const walletAddress = selectedWallet.address as Address;

    const transaction = await createMintTransactionMessage({
      client,
      walletAddress,
      mint,
      ...data,
    });

    try {
      const { signature } = await signAndSendTransaction({
        transaction,
        wallet: selectedWallet,
      });
      console.log(getBase58Decoder().decode(signature));
      console.log(mint.address);
      // await generateNewMint();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className="mx-auto p-8">
      <div className="max-w-xl">
        <Hero />
        <form
          onSubmit={onSubmit}
          className=" max-w-2xl min-h-screen bg-background text-foreground"
        >
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel
                  htmlFor="mint-address"
                  className="flex items-center"
                >
                  Mint address
                  <Badge className="leading-tight">Generated</Badge>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="mint-address"
                    placeholder="Your mint address"
                    value={mint?.address}
                    disabled
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={generateNewMint}>
                      {mint?.address ? <RefreshCwIcon /> : <Spinner />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <BaseForm />
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Extensions</FieldLegend>
              <FieldDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est,
                cupiditate?
              </FieldDescription>
              <ButtonGroup className="flex gap-2 flex-wrap">
                {Object.keys(allExtensions).map((extension) => (
                  <ButtonGroup key={extension}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setEnabledExtensions((prev) => ({
                          ...prev,
                          [extension]: true,
                        }))
                      }
                      className={cn(
                        enabledExtensions[
                          extension as keyof typeof allExtensions
                        ] && "bg-accent text-accent-foreground",
                      )}
                    >
                      {extension}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEnabledExtensions((prev) => ({
                          ...prev,
                          [extension]: false,
                        }));
                      }}
                    >
                      <XIcon />
                    </Button>
                  </ButtonGroup>
                ))}
              </ButtonGroup>
            </FieldSet>
            <FieldSeparator />

            {Object.entries(enabledExtensions)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <React.Fragment key={key}>
                  {allExtensions[key as keyof typeof allExtensions]}
                  <FieldSeparator />
                </React.Fragment>
              ))}
            <Button
              type="submit"
              disabled={!ready || !selectedWallet || mint === null}
            >
              Create mint.
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="my-10">
      <h1 className="mb-8 text-[clamp(0px,_8vw,_60px)] leading-[90%] font-bold tracking-tight text-pretty">
        Token
        <br />
        launchpad
      </h1>
      <RadioGroup
        defaultValue="token-2022"
        className="text-foreground flex items-center mb-5 "
      >
        <Field orientation="horizontal" className="opacity-60 w-fit">
          <RadioGroupItem value="token" id="token" disabled />
          <FieldLabel htmlFor="token">Token program</FieldLabel>
        </Field>
        <Field orientation="horizontal" className="w-fit">
          <RadioGroupItem value="token-2022" id="token-2022" />
          <FieldLabel htmlFor="token-2022">Token 2022 program</FieldLabel>
        </Field>
      </RadioGroup>
    </div>
  );
}
