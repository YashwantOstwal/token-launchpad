"use client";

import { useConnectWallet } from "@privy-io/react-auth";
import {
  useWallets,
  useSignAndSendTransaction,
} from "@privy-io/react-auth/solana";
import { address, generateKeyPairSigner } from "@solana/kit";
import bs58 from "bs58";
import { useMemo, useState } from "react";
import { createClient } from "@/client";
import { createMintTransactionMessage } from "@/lib/solana";

export default function Home() {
  const [client] = useState(createClient);
  const { wallets, ready } = useWallets();
  const { connectWallet } = useConnectWallet();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);
  const wallet = useMemo(() => wallets[0], [wallets]);

  async function handleClick() {
    const mintKeyPairSigner = await generateKeyPairSigner();
    const walletAddress = address(wallet.address);
    const transaction = await createMintTransactionMessage({
      mintKeyPairSigner,
      client,
      walletAddress,
      decimals: 0,
      isFreezeAuthority: false,
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
  }

  return (
    <div className="flex items-center justify-center h-screen flex-col text-black bg-red-100">
      <button
        disabled={!ready}
        onClick={() =>
          connectWallet({ description: "Using Privy as wallet adapter" })
        }
        className="p-1 border disabled:opacity-50 text-black"
      >
        {wallet ? wallet.address.slice(0, 4) : "Connect"}
      </button>

      {wallet && (
        <button
          disabled={!ready}
          onClick={() => wallet.disconnect()}
          className="p-1 border disabled:opacity-50"
        >
          Disconnect
        </button>
      )}

      <button className="border p-1" disabled={!ready} onClick={handleClick}>
        Click to creat mint.
      </button>
      {transactionSignature}
    </div>
  );
}
