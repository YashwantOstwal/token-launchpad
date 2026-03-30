import { InputAsAddress } from "../input-as-address";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "../ui/field";

function PermanentDelegate() {
  return (
    <FieldSet>
      <FieldLegend>Metadata pointer</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputAsAddress
          placeholder="Enter Permanent Delegate Address..."
          label="Permanent Delegate Address"
          registrationField="extensions.PermanentDelegate.delegate"
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { PermanentDelegate };
