"use client";

import { useConnectWallet } from "@privy-io/react-auth";
import { useSolanaWallet } from "./providers/solana-wallet-provider";
import { truncateAddress } from "@/utils";

export function Navbar() {
  const { wallet, ready } = useSolanaWallet();
  const { connectWallet } = useConnectWallet();

  return (
    <div className="p-1 flex justify-end items-center">
      <button
        disabled={!ready}
        onClick={() =>
          connectWallet({
            description: "Use Privy to connect to external wallet.",
          })
        }
        className="p-1 border disabled:opacity-50 text-black"
      >
        {wallet ? truncateAddress(wallet.address) : "Connect"}
      </button>
      <button
        disabled={!(ready && wallet)}
        onClick={() => wallet.disconnect()}
        className="p-1 border disabled:opacity-50"
      >
        Disconnect
      </button>
    </div>
  );
}
