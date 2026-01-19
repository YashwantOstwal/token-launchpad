import React from "react";
import { useSolanaWallet } from "@/components/providers/solana-wallet-provider";

export function useInputAsAddress(
  setFieldValue: (value: string) => void,
  triggerFieldValidation: () => void,
  disabledInput?: boolean
) {
  const { wallet } = useSolanaWallet();
  const [isValueWalletAddress, setIsValueWalletAddress] = React.useState(true);

  const clearInput = React.useCallback(() => {
    setFieldValue("");
    triggerFieldValidation();
    setIsValueWalletAddress(false);
  }, []);

  const toggleIsValueWalletAddressAndUpdateInput = React.useCallback(() => {
    setIsValueWalletAddress((prev) => {
      if (!prev && wallet) {
        setFieldValue(wallet.address);
        triggerFieldValidation();
      }
      return !prev;
    });
  }, []);

  React.useEffect(() => {
    if (isValueWalletAddress && wallet && !disabledInput) {
      setFieldValue(wallet.address);
      triggerFieldValidation();
    }
  }, [isValueWalletAddress, wallet, disabledInput]);
  return {
    isLoading: !wallet,
    clearInput,
    isValueWalletAddress,
    setIsValueWalletAddress,
    toggleIsValueWalletAddressAndUpdateInput,
  };
}
