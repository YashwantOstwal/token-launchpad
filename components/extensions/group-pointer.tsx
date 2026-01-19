import { InputAsAddress } from "../input-as-address";

function GroupPointer() {
  return (
    <div className="p-5">
      <InputAsAddress
        placeholder="Enter Group Pointer Authority Address..."
        label="Group Pointer Authority Address"
        registrationField="extensions.groupPointer.authority"
      />
    </div>
  );
}

export { GroupPointer };
