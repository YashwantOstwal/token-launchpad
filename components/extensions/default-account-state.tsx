"use client";

import { useEffect } from "react";
import { useMintCreationForm } from "../providers/token-creation-form";
import { AccountState } from "@solana-program/token-2022";
import {
  FieldSet,
  FieldLabel,
  FieldLegend,
  FieldDescription,
  Field,
} from "../ui/field";

function DefaultAccountState() {
  const registrationField = "extensions.DefaultAccountState.state";
  const { register, unregister } = useMintCreationForm();
  useEffect(() => {
    return () => unregister(registrationField);
  }, []);
  return (
    <FieldSet>
      <FieldLegend>Defaut account state</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, dolores.
      </FieldDescription>
      <div className="flex gap-10 items-center">
        <Field orientation="horizontal" className="w-fit">
          <input
            id="initialised"
            type="radio"
            {...register(registrationField, {})}
            value={AccountState.Initialized}
            defaultChecked
          />
          <FieldLabel htmlFor="initialised">Initialised</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <input
            id="frozen"
            type="radio"
            {...register(registrationField, {})}
            value={AccountState.Frozen}
          />
          <FieldLabel htmlFor="frozen">Frozen</FieldLabel>
        </Field>
      </div>
    </FieldSet>
  );
}

export { DefaultAccountState };
