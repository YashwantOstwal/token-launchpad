"use client";

import { useState } from "react";
import { InputAsAddress } from "../input-as-address";

function MetadataPointer() {
  const [authority, setAuthority] = useState<string>("");
  //verify using zod and on success:true, update the context.

  return (
    <div className="p-5">
      <InputAsAddress
        value={authority}
        setValue={setAuthority}
        placeholder="Enter Metadata Pointer Authority Address..."
        label="Metadata Pointer Authority Address"
      />
    </div>
  );
}

export { MetadataPointer };
