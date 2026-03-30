import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "../ui/field";

function InterestBearingTokens() {
  return (
    <FieldSet>
      <FieldLegend>Interest Bearing Token</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputWithLabel
          registrationField="extensions.InterestBearingConfig.rate"
          label="Interst rate in BPs (100BPs = 1%)"
          placeholder="100 (1%)"
          type="number"
          defaultValue={100}
        />
        <InputAsAddress
          placeholder="Enter Rate Authority Address..."
          label="Rate Authority Address"
          registrationField="extensions.InterestBearingConfig.rateAuthority"
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { InterestBearingTokens };
