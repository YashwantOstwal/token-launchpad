"use client";

import React from "react";
import { useFormState, useForm, FieldPath } from "react-hook-form";
import { z } from "zod";
import { isAddress, isOffCurveAddress } from "@solana/kit";
import { zodResolver } from "@hookform/resolvers/zod";

const address = z.string().refine((value) => isAddress(value) && true, {
  message: "must be a valid ed-25519 address",
});

const requiredString = z
  .string({
    error: "Required",
  })
  .min(1);
const formSchema = z.object({
  // base: z.object({
  mintAuthority: address,
  freezeAuthority: address.optional(),
  decimals: z.number().nonnegative().min(0).max(9),
  // }),
  extensions: z
    .object({
      MintCloseAuthority: z
        .object({
          closeAuthority: address,
        })
        .optional(),
      PermanentDelegate: z
        .object({
          delegate: address,
        })
        .optional(),
      MetadataPointer: z
        .object({
          authority: address,
        })
        .optional(),
      TokenMetadata: z
        .object({
          symbol: requiredString,
          name: requiredString,
          updateAuthority: address,
          uri: requiredString.url(),
        })
        .optional(),
      TransferFeeConfig: z
        .object({
          maximumFee: z.number().min(0),
          withdrawWithheldAuthority: address.optional(),
          transferFeeConfigAuthority: address.optional(),
          transferFeeBasisPoints: z.number().min(0),
        })
        .optional(),
      InterestBearingConfig: z
        .object({
          rateAuthority: address,
          rate: z.number().min(0),
        })
        .optional(),
      DefaultAccountState: z
        .object({
          state: z.enum(["1", "2"]),
        })
        .optional(),

      NonTransferable: z.object({}).optional(),
      CpiGuard: z
        .object({
          lock: z.boolean(),
        })
        .optional(),

      TokenGroup: z
        .object({
          maxSize: z.number().min(0),
          updateAuthority: address,
        })
        .optional(),
      GroupPointer: z
        .object({
          authority: address,
        })
        .optional(),
      GroupMemberPointer: z
        .object({
          authority: address,
        })
        .optional(),
      TokenGroupMember: z
        .object({
          group: address,
        })
        .optional(),
    })
    .optional(),
});

export type FormFields = z.infer<typeof formSchema>;

export type AllFieldPaths = FieldPath<FormFields>;

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
    resolver: zodResolver(formSchema),
    //dont use default values for conditional fields --> it is causing unpredictable behaviour.
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
