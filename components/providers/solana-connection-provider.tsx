"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { connection } from "@/connection";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

export function SolanaConnectionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { chain, ...rest } = connection;
  return (
    <PrivyProvider
      appId="cmjuf6ftn021ml50cszzykcsu"
      config={{
        solana: {
          rpcs: {
            "solana:devnet": {
              // Only needed if you need to use Privy wallets for sending transactions
              rpc: createSolanaRpc("https://api.devnet.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions(
                "wss://api.devnet.solana.com"
              ),
            },
            "solana:mainnet": {
              // Only needed if you need to use Privy wallets for sending transactions
              rpc: createSolanaRpc("https://api.mainnet-beta.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions(
                "wss://api.mainnet-beta.solana.com"
              ),
            },
          },
        },
        appearance: {
          walletChainType: "solana-only",
          walletList: ["phantom", "detected_solana_wallets"],
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({
              shouldAutoConnect: true,
            }),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
