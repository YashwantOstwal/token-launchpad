import { InputAsAddress } from "../input-as-address";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "../ui/field";
function MintCloseAuthority() {
  return (
    <FieldSet>
      <FieldLegend>Metadata pointer</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputAsAddress
          placeholder="Enter Mint Close Authority Address..."
          label="Mint Close Authority Address"
          registrationField="extensions.MintCloseAuthority.closeAuthority"
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { MintCloseAuthority };
