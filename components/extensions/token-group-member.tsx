import { InputAsAddress } from "../input-as-address";
import { FieldSet, FieldLegend, FieldDescription } from "../ui/field";

function TokenGroupMember() {
  return (
    <FieldSet>
      <FieldLegend>Token group member</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum,
        possimus.
      </FieldDescription>
      <InputAsAddress
        placeholder="Enter Group Pointer Authority Address..."
        label="Group Pointer Authority Address"
        registrationField="extensions.TokenGroupMember.group"
      />
    </FieldSet>
  );
}

export { TokenGroupMember };
