"use client";

import { createClient } from "@/client";
import { useSolanaWallet } from "@/components/providers/solana-wallet-provider";
import { useState } from "react";
import {
  findAddressLookupTablePda,
  getCreateLookupTableInstructionAsync,
  getExtendLookupTableInstruction,
  fetchAddressLookupTable,
} from "@solana-program/address-lookup-table";
import { getTransferSolInstruction } from "@solana-program/system";
import {
  Address,
  address,
  type AddressesByLookupTableAddress,
  appendTransactionMessageInstructions,
  compressTransactionMessageUsingAddressLookupTables,
  createNoopSigner,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  lamports,
  partiallySignTransactionMessageWithSigners,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import {
  useSignAndSendTransaction,
  useSignTransaction,
} from "@privy-io/react-auth/solana";
import bs58 from "bs58";

function Page() {
  const [client] = useState(createClient);
  const [altAddress, setAltAddress] = useState<null | Address>(null);
  const { ready, wallet } = useSolanaWallet();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  // const {signTransaction} = useSignTransaction();
  async function handleCreateALTAccount() {
    if (!wallet) return;
    const [recentSlot, latestBlockhash] = await Promise.all([
      client.rpc.getSlot().send(),
      client.rpc.getLatestBlockhash().send(),
    ]);
    const walletAddress = address(wallet.address);
    const walletSigner = createNoopSigner(walletAddress);

    const createLookupTableIxn = await getCreateLookupTableInstructionAsync({
      // payer:walletSigner,
      authority: walletSigner,
      recentSlot,
    });

    const transactionMessage =
      // await
      pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(walletAddress), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(
            latestBlockhash.value,
            tx
          ),
        (tx) => appendTransactionMessageInstructions([createLookupTableIxn], tx)
        // (tx)=>compressTransactionMessageUsingAddressLookupTables(tx,)
        // (tx) => client.estimateAndSetComputeUnitLimit(tx)
      );
    const partiallySignedTransactionMessage =
      await partiallySignTransactionMessageWithSigners(transactionMessage);
    const encodedTransaction = getBase64EncodedWireTransaction(
      partiallySignedTransactionMessage
    );

    const { signature } = await signAndSendTransaction({
      transaction: Buffer.from(encodedTransaction, "base64"),
      wallet,
    });

    //poll Signature status possibly

    //  const signedTransction = await signTransaction({
    //   transaction: Buffer.from(encodedTransaction, "base64"),
    //   wallet,
    // });

    // const sendAndConfirmTransaction =  sendAndConfirmTransactionFactory({rpc:client.rpc,rpcSubscriptions:client.rpcSubscriptions})

    // await sendAndConfirmTransaction(bs58.encode(signedTransction),{commitment:'confirmed'})

    const [altAddress] = await findAddressLookupTablePda({
      authority: walletAddress,
      recentSlot,
    });
    setAltAddress(altAddress);

    console.log({ signature: bs58.encode(signature) });
  }

  async function fetchALTAccount(altAddress: Address) {
    const altAccount = await client.rpc
      .getAccountInfo(altAddress, {
        encoding: "jsonParsed",
        commitment: "confirmed",
      })
      .send();

    console.log({ altAddress, altAccount });
  }

  async function extendALTAccount(altAddress: Address) {
    if (!wallet) return;
    const walletAddress = address(wallet.address);
    const walletSigner = createNoopSigner(walletAddress);

    const { value: latestBlockhash } = await client.rpc
      .getLatestBlockhash()
      .send();

    const extendALTAccountIxn = getExtendLookupTableInstruction({
      authority: walletSigner,
      payer: walletSigner,
      address: altAddress,
      addresses: [
        walletAddress,
        address("Es5XNFKXRRyPue823jhp4StroXCvCZT1AMB51A8CCGNK"),
        address("5jnqhUeu3grcXZB4MZReCxUoMxpdRCBGHStyPop1h1dc"),
        address("8HkVeZsusfgrzPfTSRRv29wjdg89CCZ6sMhwDxQBjkD3"),
      ],
    });

    const transactionMessage =
      // await
      pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(walletAddress), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([extendALTAccountIxn], tx)
        // (tx) => client.estimateAndSetComputeUnitLimit(tx)
      );
    const partiallySignedTransactionMessage =
      await partiallySignTransactionMessageWithSigners(transactionMessage);
    const encodedTransaction = getBase64EncodedWireTransaction(
      partiallySignedTransactionMessage
    );

    const { signature } = await signAndSendTransaction({
      transaction: Buffer.from(encodedTransaction, "base64"),
      wallet,
    });
    console.log({ signature: bs58.encode(signature) });
  }

  async function signAndSendTransactionV0WithALT(altAddress: Address) {
    const walletAddress = address(wallet.address);
    const walletSigner = createNoopSigner(walletAddress);
    const transferSolIxn = getTransferSolInstruction({
      source: walletSigner,
      destination: address("5jnqhUeu3grcXZB4MZReCxUoMxpdRCBGHStyPop1h1dc"),
      amount: lamports(BigInt(100000)),
    });

    const { value: latestBlockhash } = await client.rpc
      .getLatestBlockhash()
      .send();
    const {
      data: { addresses },
    } = await fetchAddressLookupTable(client.rpc, altAddress);
    const addressesByAddressLookupTable: AddressesByLookupTableAddress = {
      [altAddress]: addresses,
    };

    const transactionMessage =
      // await
      pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(walletAddress), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([transferSolIxn], tx),
        (tx) =>
          compressTransactionMessageUsingAddressLookupTables(
            tx,
            addressesByAddressLookupTable
          )
      );
    const partiallySignedTransactionMessage =
      await partiallySignTransactionMessageWithSigners(transactionMessage);
    const encodedTransaction = getBase64EncodedWireTransaction(
      partiallySignedTransactionMessage
    );

    const { signature } = await signAndSendTransaction({
      transaction: Buffer.from(encodedTransaction, "base64"),
      wallet,
    });
    console.log({ signature: bs58.encode(signature) });
  }
  return (
    <div className="bg-red-100 flex flex-col items-center justify-center h-screen">
      <button
        disabled={!ready}
        onClick={handleCreateALTAccount}
        className="p-2 border"
      >
        Click to create ALT
      </button>
      <button
        disabled={!altAddress}
        className="p-2 border"
        onClick={() => {
          if (!altAddress) return;
          fetchALTAccount(altAddress);
        }}
      >
        Fetch newly created ALT account
      </button>
      <button
        disabled={!altAddress}
        className="p-2 border"
        onClick={() => {
          if (!altAddress) return;
          extendALTAccount(altAddress);
        }}
      >
        extend the newly created ALT account
      </button>
      <button
        disabled={!altAddress}
        className="p-2 border"
        onClick={() => {
          if (!altAddress) return;
          signAndSendTransactionV0WithALT(altAddress);
        }}
      >
        signAndSendTransactionV0WithALT
      </button>
    </div>
  );
}

export default Page;
