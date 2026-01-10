"use client";

import { useState } from "react";
import { useSolanaWallet } from "./providers/solana-wallet-provider";
import { createClient } from "@/client";
import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";

function CreateMintButton() {
  const { ready, wallet } = useSolanaWallet();
  const [client] = useState(createClient);
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  // async function handleClick() {
  //   const walletAddress = address(wallet.address);
  //   const transaction = await createMintTransactionMessage({
  //     mintKeyPairSigner: mint as KeyPairSigner<"string">,
  //     client,
  //     walletAddress,
  //     decimals: decimals as number,
  //     isFreezeAuthority:hasFreezeAuthority,
  //   });
  //   try {
  //     const { signature } = await signAndSendTransaction({
  //       transaction,
  //       wallet,
  //     });
  //     setTransactionSignature(bs58.encode(signature));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // useEffect(() => {
  //   if (ready && wallet && mintAuthorityAddress === null) {
  //     setMintAuthorityAddress(wallet.address);
  //   }

  //   if (
  //     ready &&
  //     wallet &&
  //     isFreezeAuthority &&
  //     freezeAuthorityAddress === null
  //   ) {
  //     setFreezeAuthorityAddress(wallet.address);
  //   }
  // }, [wallet, ready, isFreezeAuthority]);

  return (
    <button
      className="border p-1 disabled:opacity-50"
      disabled={!ready || !wallet}
      // onClick={handleClick}
    >
      Click to creat mint.
    </button>
  );
}

export { CreateMintButton };
