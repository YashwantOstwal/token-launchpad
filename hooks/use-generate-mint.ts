import { generateKeyPairSigner, type KeyPairSigner } from "@solana/kit";
import { useEffect, useState } from "react";

export function useGenerateKeyPairSigner() {
  const [keyPair, setKeyPairSigner] = useState<KeyPairSigner<string> | null>(
    null
  );

  async function generateNewKeyPair() {
    const newKeyPair = await generateKeyPairSigner();
    setKeyPairSigner(newKeyPair);
  }
  useEffect(() => {
    generateNewKeyPair();
  }, []);
  return [keyPair, generateNewKeyPair] as const;
}
