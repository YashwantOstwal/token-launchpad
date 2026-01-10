import { useSolanaWallet } from "@/components/providers/solana-wallet-provider";
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

export function useInputAsAddress(setValue: (value: string) => void) {
  const { ready, wallet } = useSolanaWallet();
  const [isValueWalletAddress, setIsValueWalletAddress] = useState(true);

  const toggleIsValueWalletAddress = useCallback(() => {
    const newValue = !isValueWalletAddress;
    if (newValue) {
      setValue(wallet.address);
    }
    setIsValueWalletAddress(newValue);
  }, []);

  const clearInput = useCallback(() => {
    setValue("");
  }, []);

  useEffect(() => {
    if (wallet && ready) {
      setValue(wallet.address);
    }
  }, [wallet, ready]);
  return {
    disabled: !ready && !wallet,
    clearInput,
    isValueWalletAddress,
    toggleIsValueWalletAddress,
  };
}
