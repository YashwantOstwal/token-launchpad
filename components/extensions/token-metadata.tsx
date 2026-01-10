"use client";

import { useState } from "react";
import { InputAsAddress } from "../input-as-address";

function TokenMetadata() {
  const [uri, setUri] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [updateAuthority, setUpdateAuthority] = useState<string>("");

  //verify using zod and on success:true, update the context.

  return (
    <div className="p-5">
      <InputAsAddress
        value={name}
        setValue={setName}
        placeholder="Enter Name of your token..."
        label="Name of your token"
      />
      <InputAsAddress
        value={symbol}
        setValue={setSymbol}
        placeholder="Enter Symbol of your token..."
        label="Symbol of your token"
      />
      <InputAsAddress
        value={uri}
        setValue={setUri}
        placeholder="Enter Uri of your token..."
        label="Uri of your token"
      />
      <InputAsAddress
        value={updateAuthority}
        setValue={setUpdateAuthority}
        placeholder="Enter Update Authority Address..."
        label="Update Authority Address"
      />
    </div>
  );
}

export { TokenMetadata };
