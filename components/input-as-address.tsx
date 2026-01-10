"use client";

import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";
import bs58 from "bs58";
import { SetStateAction, useCallback, useEffect, useId, useState } from "react";
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
import { RefreshCwIcon, CircleXIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useGenerateKeyPairSigner } from "@/hooks/use-generate-mint";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useInputAsAddress } from "@/hooks/use-input-as-address";
import { useTokenCreationForm } from "./providers/token-creation-form";
import { FormFields } from "./providers/token-creation-form";
function InputAsAddress({
  label,
  placeholder,
  registrationId,
}: {
  label: string;
  placeholder: string;
  registrationId: keyof FormFields;
}) {
  const { register, setValue } = useTokenCreationForm();
  const {
    disabled,
    clearInput,
    isValueWalletAddress,
    toggleIsValueWalletAddress,
  } = useInputAsAddress((value: string) => {
    setValue(registrationId, value);
  });
  return (
    <div>
      <Label htmlFor={registrationId}>{label}</Label>
      <InputGroup>
        <InputGroupInput
          id={registrationId}
          placeholder={placeholder}
          {...register(registrationId, {
            onChange: toggleIsValueWalletAddress,
          })}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className={cn(
              isValueWalletAddress && "bg-green-300 hover:bg-green-400"
            )}
            onClick={toggleIsValueWalletAddress}
            disabled={disabled}
          >
            <InputGroupText>Set to wallet address</InputGroupText>
          </InputGroupButton>
          <InputGroupButton onClick={clearInput}>
            <CircleXIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export { InputAsAddress };
