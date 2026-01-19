"use client";

import React from "react";
import { useFormState, useForm, FieldPath } from "react-hook-form";
import { z } from "zod";
import { isAddress, isOffCurveAddress } from "@solana/kit";
import { zodResolver } from "@hookform/resolvers/zod";

const address = z
  .string()
  .refine((value) => isAddress(value) && !isOffCurveAddress(value), {
    message: "must be a valid account address",
  });

const requiredString = z.string().min(1, {
  message: "Required field",
});
const schema = z.object({
  // base: z.object({
  mintAuthority: address,
  freezeAuthority: z
    .string()
    .optional()
    .refine((value) => value && isAddress(value) && !isOffCurveAddress(value), {
      message: "must be a valid account address",
    }),
  decimals: z.number().min(0).max(9),
  // }),
  extensions: z
    .object({
      mintCloseAuthority: z
        .object({
          closeAuthority: address,
        })
        .optional(),
      permanentDelegate: z
        .object({
          delegate: address,
        })
        .optional(),
      metadataPointer: z
        .object({
          authority: address,
        })
        .optional(),
      tokenMetadata: z
        .object({
          symbol: requiredString,
          name: requiredString,
          updateAuthority: address,
          uri: requiredString.url(),
        })
        .optional(),
      transferFeeConfig: z
        .object({
          maximumFee: z.number().min(0),
          withdrawWithheldAuthority: address,
          transferFeeConfigAuthority: address,
          transferFeeBasisPoints: z.number().min(0),
        })
        .optional(),
      interestBearingTokens: z
        .object({
          rateAuthority: address,
          rate: z.number().min(0),
        })
        .optional(),
      defaultAccountState: z
        .object({
          state: z.enum(["1", "2"]),
        })
        .optional(),

      nonTransferable: z.object({}).optional(),
      cpiGuard: z
        .object({
          lock: z.boolean(),
        })
        .optional(),

      tokenGroup: z
        .object({
          maxSize: z.number().min(0),
          updateAuthority: address,
        })
        .optional(),
      groupPointer: z
        .object({
          authority: address,
        })
        .optional(),
    })
    .optional(),
});

export type FormFields = z.infer<typeof schema>;

type AllFieldPaths = FieldPath<FormFields>;
export type RegsiteredFields =
  | "mintAuthority"
  | "freezeAuthority"
  | "decimals"
  | "extensions.mintCloseAuthority.closeAuthority"
  | "extensions.permanentDelegate.delegate"
  | "extensions.metadataPointer.authority"
  | "extensions.tokenMetadata.symbol"
  | "extensions.tokenMetadata.name"
  | "extensions.tokenMetadata.updateAuthority"
  | "extensions.tokenMetadata.uri"
  | "extensions.transferFeeConfig.maximumFee"
  | "extensions.transferFeeConfig.withdrawWithheldAuthority"
  | "extensions.transferFeeConfig.transferFeeConfigAuthority"
  | "extensions.transferFeeConfig.transferFeeBasisPoints"
  | "extensions.interestBearingTokens.rateAuthority"
  | "extensions.interestBearingTokens.rate"
  | "extensions.defaultAccountState.state"
  | "extensions.cpiGuard.lock"
  | "extensions.nonTransferable"
  | "extensions.tokenGroup.updateAuthority"
  | "extensions.tokenGroup.maxSize"
  | "extensions.groupPointer.authority";

const TokenCreationFormContext = React.createContext<ReturnType<
  typeof useForm<FormFields>
> | null>(null);

function TokenCreationFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<FormFields>({
    mode: "onChange",
    resolver: zodResolver(schema),
    //dont use default values for conditional fields.
  });

  const formState = useFormState({ control: form.control });

  return (
    <TokenCreationFormContext.Provider value={{ ...form, formState }}>
      {children}
    </TokenCreationFormContext.Provider>
  );
}

function useMintCreationForm() {
  const ctx = React.useContext(TokenCreationFormContext);
  if (!ctx) {
    throw new Error(
      "useMintCreationForm must be used within a TokenCreationFormProvider",
    );
  }
  return ctx;
}
export { TokenCreationFormProvider, useMintCreationForm };
