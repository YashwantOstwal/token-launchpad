"use client";
import {
  useWallets,
  type UseWallets,
  type ConnectedStandardSolanaWallet,
} from "@privy-io/react-auth/solana";
import { createContext, type ReactNode, useContext, useMemo } from "react";

interface UseWallet extends Omit<UseWallets, "wallets"> {
  wallet: ConnectedStandardSolanaWallet;
}
const SolanaWallet = createContext<UseWallet | null>(null);
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const { wallets, ready } = useWallets();

  const wallet = useMemo(() => wallets[0], [wallets]);

  return (
    <SolanaWallet.Provider
      value={{
        wallet,
        ready,
      }}
    >
      {children}
    </SolanaWallet.Provider>
  );
}

export function useSolanaWallet() {
  const ctx = useContext(SolanaWallet);
  if (!ctx) {
    throw new Error("useSolanaWallet must be used with SolanaWalletProvider");
  }
  return ctx;
}
