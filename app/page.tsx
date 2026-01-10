"use client";

import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";
import { address, type KeyPairSigner } from "@solana/kit";
import bs58 from "bs58";
import { useEffect, useState } from "react";
import { createClient } from "@/client";
import { createMintTransactionMessage } from "@/lib/solana";
import { useSolanaWallet } from "@/components/providers/solana-wallet-provider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { MintCloseAuthority } from "@/components/extensions/mint-close-authority";
import { RefreshCwIcon, CircleXIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useGenerateKeyPairSigner } from "@/hooks/use-generate-mint";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { PermanentDelegate } from "@/components/extensions/permanent-delegate";
import { MetadataPointer } from "@/components/extensions/metadata-pointer";
import { TokenMetadata } from "@/components/extensions/token-metadata";
import { useForm } from "react-hook-form";

interface FormFields {
  mintAddress: string;
  mintAuthorityAddress: string;
  freezeAuthorityAddress: string;
}
export default function Home() {
  const [mint, generateNewMint] = useGenerateKeyPairSigner();
  const [hasFreezeAuthority, setHasFreezeAuthority] = useState(true);

  const { wallet, ready } = useSolanaWallet();

  return (
    <form className="pt-20  min-h-screen bg-background text-foreground">
      <div>
        <Label htmlFor="mint-address">Mint address</Label>
        <InputGroup>
          <InputGroupInput
            id="mint-address"
            placeholder="Your mint address"
            value={mint ? mint.address : ""}
            disabled
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={generateNewMint}>
              {!mint && <Spinner />}
              <RefreshCwIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <Label htmlFor="mint-authority-address">Mint Authority address</Label>
        <InputGroup>
          <InputGroupInput
            id="mint-authority-address"
            placeholder="Enter you mint authority address"
            value={mintAuthorityAddress === null ? "" : mintAuthorityAddress}
            onChange={(e) => setMintAuthorityAddress(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              className={cn(
                mintAuthorityAddress === wallet?.address && "bg-accent "
              )}
              onClick={() => setMintAuthorityAddress(wallet.address)}
              disabled={!ready && !wallet}
            >
              <InputGroupText>Set to wallet address</InputGroupText>
            </InputGroupButton>
            <InputGroupButton onClick={() => setMintAuthorityAddress(null)}>
              <CircleXIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <button
          className="p-1 border-2"
          onClick={handleIsFreezeAuthorityToggle}
        >
          {isFreezeAuthority ? "On" : "Off"}
        </button>
        <Label htmlFor="freeze-authority-address">Freeze authority</Label>
        <InputGroup>
          <InputGroupInput
            id="freeze-authority-address"
            placeholder="Enter you freeze authority address"
            disabled={!isFreezeAuthority}
            value={
              isFreezeAuthority
                ? freezeAuthorityAddress !== null
                  ? freezeAuthorityAddress
                  : ""
                : ""
            }
            onChange={(e) => setFreezeAuthorityAddress(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              className={cn(
                freezeAuthorityAddress === wallet?.address && "bg-accent "
              )}
              onClick={() => setFreezeAuthorityAddress(wallet.address)}
              disabled={!ready || !wallet || !isFreezeAuthority}
            >
              <InputGroupText>Set to wallet address</InputGroupText>
            </InputGroupButton>
            <InputGroupButton
              disabled={!isFreezeAuthority}
              onClick={() => setFreezeAuthorityAddress(null)}
            >
              <CircleXIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <Label htmlFor="decimals">Decimals</Label>
        <InputGroup>
          <InputGroupInput
            id="decimals"
            placeholder="Enter the decimals"
            value={typeof decimals === "number" ? decimals : ""}
            type="number"
            max={9}
            min={0}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setDecimals(null);
              } else {
                setDecimals(Number(value[value.length - 1]));
              }
            }}
          />
        </InputGroup>
      </div>
      <div className="p-1">
        <h2>Extensions</h2>
        <MintCloseAuthority />
        <PermanentDelegate />
        <MetadataPointer />
        <TokenMetadata />
      </div>
      <button
        className="border p-1 disabled:opacity-50"
        disabled={!ready || !wallet}
        // onClick={handleClick}
      >
        Click to creat mint.
      </button>
      {/* {transactionSignature} */}
    </form>
  );
}
