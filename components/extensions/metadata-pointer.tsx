import { InputAsAddress } from "../input-as-address";

function MetadataPointer() {
  return (
    <div className="p-5">
      <InputAsAddress
        placeholder="Enter Metadata Pointer Authority Address..."
        label="Metadata Pointer Authority Address"
        registrationField="extensions.metadataPointer.authority"
      />
    </div>
  );
}

export { MetadataPointer };
