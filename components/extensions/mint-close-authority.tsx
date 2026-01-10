"use client";

import { useState } from "react";
import { InputAsAddress } from "../input-as-address";

function MintCloseAuthority() {
  const [closeAuthority, setCloseAuthority] = useState<string>("");
  //verify using zod and on success:true, update the context.

  return (
    <div className="p-5">
      <InputAsAddress
        value={closeAuthority}
        setValue={setCloseAuthority}
        placeholder="Enter Mint Close Authority Address..."
        label="Mint Close Authority Address"
      />
    </div>
  );
}

export { MintCloseAuthority };
