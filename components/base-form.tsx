"use client";
import { InputAsAddress } from "./input-as-address";

import React from "react";
import { toggle } from "@/utils";
import { InputWithLabel } from "./input-with-label";

function BaseForm() {
  return (
    <>
      <MintAuthorityField />
      <FreezeAuthorityField />
      <DecimalsField />
    </>
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
  return (
    <InputAsAddress
      label="Freeze Authority Address"
      placeholder="Enter your Freeze Authority Address"
      registrationField="freezeAuthority"
      // optional
    />
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
