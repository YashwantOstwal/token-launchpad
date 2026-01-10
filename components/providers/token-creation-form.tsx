"use client";

import React from "react";
import { useForm } from "react-hook-form";

const TokenCreationFormContext = React.createContext<ReturnType<
  typeof useForm<FormFields>
> | null>(null);

export interface FormFields {
  mintAddress: string;
  mintAuthorityAddress: string;
  freezeAuthorityAddress: string;
}
function TokenCreationFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      mintAddress: "",
      mintAuthorityAddress: "",
      freezeAuthorityAddress: "",
    },
  });
  return (
    <TokenCreationFormContext.Provider value={form}>
      {children}
    </TokenCreationFormContext.Provider>
  );
}

function useTokenCreationForm() {
  const ctx = React.useContext(TokenCreationFormContext);
  if (!ctx) {
    throw new Error(
      "useTokenCreationForm must be used within a TokenCreationFormProvider"
    );
  }
  return ctx;
}
export { TokenCreationFormProvider, useTokenCreationForm };
