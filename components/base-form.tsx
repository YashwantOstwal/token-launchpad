"use client";
import { InputAsAddress } from "./input-as-address";

import React from "react";
import { toggle } from "@/utils";
import { InputWithLabel } from "./input-with-label";

function BaseForm() {
  return (
    <div>
      <MintAuthorityField />
      <FreezeAuthorityField />
      <DecimalsField />
    </div>
  );
}

function DecimalsField() {
  return (
    <InputWithLabel
      registrationField="decimals"
      label="Decimals"
      placeholder="Enter the decimals of your token"
      type="number"
      defaultValue={9}
    />
  );
}
function FreezeAuthorityField() {
  const [hasFreezeAuthority, setHasFreezeAuthority] =
    React.useState<boolean>(true);
  return (
    <div>
      <button
        type="button"
        className="p-1 border-2"
        onClick={() => {
          setHasFreezeAuthority(toggle);
        }}
      >
        {hasFreezeAuthority ? "On" : "Off"}
      </button>
      <InputAsAddress
        label="Freeze Authority Address"
        placeholder="Enter your Freeze Authority Address"
        registrationField="freezeAuthority"
        disabledInput={!hasFreezeAuthority}
      />
    </div>
  );
}
function MintAuthorityField() {
  return (
    <InputAsAddress
      label="Mint Authority Address"
      placeholder="Enter your Mint Authority Address"
      registrationField="mintAuthority"
    />
  );
}

export { BaseForm };
