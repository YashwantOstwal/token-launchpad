"use client";

import { useEffect } from "react";
import { useMintCreationForm } from "../providers/token-creation-form";
import { FieldSet, FieldLegend, FieldDescription } from "../ui/field";
function NonTransferable() {
  const registrationField = "extensions.NonTransferable";
  const { register, unregister } = useMintCreationForm();
  useEffect(() => {
    register(registrationField, { value: {} });
    return () => unregister(registrationField);
  }, [register, unregister]);
  return (
    <FieldSet>
      <FieldLegend>Non Transferable Mint</FieldLegend>
      <FieldDescription>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus,
        dolore.
      </FieldDescription>
    </FieldSet>
  );
}

export { NonTransferable };
