import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";

function TransferFeeConfig() {
  return (
    <div className="p-5">
      <InputWithLabel
        registrationField="extensions.transferFeeConfig.transferFeeBasisPoints"
        label="Transfer fees in BPs (100BPs = 1%)"
        placeholder="Enter the transfer fees"
        type="number"
        defaultValue={250}
      />
      <InputWithLabel
        registrationField="extensions.transferFeeConfig.maximumFee"
        label="Maximum Tranfer fees"
        type="number"
        placeholder={`1000000000 (Maximum fee of 1 token if "Decimals" is "9")`}
        defaultValue={1000000000}
      />

      <InputAsAddress
        placeholder="Enter Tranfer fee config Authority Address..."
        label="Tranfer fee config Authority Address"
        registrationField="extensions.transferFeeConfig.transferFeeConfigAuthority"
      />
      <InputAsAddress
        placeholder="Enter Withdraw Withheld Authority Address..."
        label="Withdraw Withheld Authority Address"
        registrationField="extensions.transferFeeConfig.withdrawWithheldAuthority"
      />
    </div>
  );
}

export { TransferFeeConfig };
