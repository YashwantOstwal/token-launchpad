"use client";

import { useState } from "react";
import { InputAsAddress } from "../input-as-address";

function PermanentDelegate() {
  const [permanentDelegate, setPermanentDelegate] = useState<string>("");
  //verify using zod and on success:true, update the context.

  return (
    <div className="p-5">
      <InputAsAddress
        value={permanentDelegate}
        setValue={setPermanentDelegate}
        placeholder="Enter Permanent Delegate Address..."
        label="Permanent Delegate Address"
      />
    </div>
  );
}

export { PermanentDelegate };
