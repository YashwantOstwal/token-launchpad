import { InputAsAddress } from "../input-as-address";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "../ui/field";

function MetadataPointer() {
  return (
    <FieldSet>
      <FieldLegend>Metadata pointer</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputAsAddress
          placeholder="Enter Metadata Pointer Authority Address..."
          label="Metadata Pointer Authority Address"
          registrationField="extensions.MetadataPointer.authority"
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { MetadataPointer };
