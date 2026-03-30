import { useEffect } from "react";
import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "../ui/field";

function TokenGroup() {
  return (
    <FieldSet>
      <FieldLegend>Metadata pointer</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputWithLabel
          registrationField="extensions.TokenGroup.maxSize"
          placeholder="Enter the maximum number of member mints of this group"
          label="Maximum size of the group mint"
          type="number"
          defaultValue={10}
        />
        <InputAsAddress
          placeholder="Enter Update Authority Address..."
          label="Update Authority Address"
          registrationField="extensions.TokenGroup.updateAuthority"
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { TokenGroup };
