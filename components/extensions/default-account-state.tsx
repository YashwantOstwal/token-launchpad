"use client";

import { useEffect } from "react";
import { useMintCreationForm } from "../providers/token-creation-form";
import { AccountState } from "@solana-program/token-2022";
function DefaultAccountState() {
  const registrationField = "extensions.defaultAccountState.state";
  const { register, unregister } = useMintCreationForm();
  useEffect(() => {
    return () => unregister(registrationField);
  }, []);
  return (
    <div className="p-5 flex items-center gap-5">
      <div className="flex items-center gap-2">
        <input
          id="initialised"
          type="radio"
          {...register(registrationField, {
            // does not work
            // valueAsNumber: true,
            // valueAsDate: false,
          })}
          value={AccountState.Initialized}
          defaultChecked
        />
        <label htmlFor="initialised">Initialised</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="frozen"
          type="radio"
          {...register(registrationField, {
            // does not work
            // valueAsNumber: true,
            // valueAsDate: false,
          })}
          value={AccountState.Frozen}
        />
        <label htmlFor="frozen">Frozen</label>
      </div>
    </div>
  );
}

export { DefaultAccountState };
