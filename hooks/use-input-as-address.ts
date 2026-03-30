import { usePrivyAsSolanaWallet } from "@/components/providers/privy-as-solana-wallet";
import React from "react";

export function useInputAsAddress(
  setFieldValue: (value: string) => void,
  triggerFieldValidation: () => void,
  disabledInput?: boolean,
) {
  const { selectedWallet } = usePrivyAsSolanaWallet();
  const [isValueWalletAddress, setIsValueWalletAddress] = React.useState(true);

  const clearInput = React.useCallback(() => {
    setFieldValue("");
    triggerFieldValidation();
    setIsValueWalletAddress(false);
  }, []);

  const toggleIsValueWalletAddressAndUpdateInput = React.useCallback(() => {
    setIsValueWalletAddress((prev) => {
      if (!prev && selectedWallet) {
        setFieldValue(selectedWallet.address);
        triggerFieldValidation();
      }
      return !prev;
    });
  }, []);

  React.useEffect(() => {
    if (isValueWalletAddress && selectedWallet && !disabledInput) {
      setFieldValue(selectedWallet.address);
      triggerFieldValidation();
    }
  }, [isValueWalletAddress, selectedWallet, disabledInput]);
  return {
    isLoading: !selectedWallet,
    clearInput,
    isValueWalletAddress,
    setIsValueWalletAddress,
    toggleIsValueWalletAddressAndUpdateInput,
  };
}
