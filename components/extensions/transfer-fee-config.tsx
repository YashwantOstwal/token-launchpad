import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";

import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "../ui/field";
function TransferFeeConfig() {
  return (
    <FieldSet>
      <FieldLegend>Transfer fee config</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputAsAddress
          placeholder="Enter Tranfer fee config Authority Address..."
          label="Tranfer fee config Authority Address"
          registrationField="extensions.TransferFeeConfig.transferFeeConfigAuthority"
          optional
        />
        <InputAsAddress
          placeholder="Enter Withdraw Withheld Authority Address..."
          label="Withdraw Withheld Authority Address"
          registrationField="extensions.TransferFeeConfig.withdrawWithheldAuthority"
          optional
        />
        <InputWithLabel
          registrationField="extensions.TransferFeeConfig.transferFeeBasisPoints"
          label="Transfer fees in BPs (100BPs = 1%)"
          placeholder="Enter the transfer fees"
          type="number"
          defaultValue={250}
        />
        <InputWithLabel
          registrationField="extensions.TransferFeeConfig.maximumFee"
          label="Maximum Tranfer fees"
          type="number"
          placeholder={`1000000000 (Maximum fee of 1 token if "Decimals" is "9")`}
          defaultValue={1000000000}
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { TransferFeeConfig };
