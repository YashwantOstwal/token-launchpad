import { generateKeyPairSigner, type KeyPairSigner } from "@solana/kit";
import { run } from "@/utils";
import { useEffect, useState, useCallback } from "react";

export function useGenerateKeyPairSigner() {
  const [keyPair, setKeyPairSigner] = useState<KeyPairSigner<string> | null>(
    null,
  );

  const generateNewKeyPair = useCallback(async () => {
    const newKeyPair = await generateKeyPairSigner();
    setKeyPairSigner(newKeyPair);
  }, []);

  useEffect(() => {
    run(generateNewKeyPair);
  }, []);
  return [keyPair, generateNewKeyPair] as const;
}
