import { useEffect } from "react";
import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";

function TokenGroup() {
  return (
    <div className="p-5">
      <InputWithLabel
        registrationField="extensions.tokenGroup.maxSize"
        placeholder="Enter the maximum number of member mints of this group"
        label="Maximum size of the group mint"
        type="number"
        defaultValue={10}
      />
      <InputAsAddress
        placeholder="Enter Update Authority Address..."
        label="Update Authority Address"
        registrationField="extensions.tokenGroup.updateAuthority"
      />
    </div>
  );
}

export { TokenGroup };
