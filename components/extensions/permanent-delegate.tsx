import { InputAsAddress } from "../input-as-address";

function PermanentDelegate() {
  return (
    <div className="p-5">
      <InputAsAddress
        placeholder="Enter Permanent Delegate Address..."
        label="Permanent Delegate Address"
        registrationField="extensions.permanentDelegate.delegate"
      />
    </div>
  );
}

export { PermanentDelegate };
