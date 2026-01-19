"use client";

import { useEffect } from "react";
import { useMintCreationForm } from "../providers/token-creation-form";
function NonTransferable() {
  const registrationField = "extensions.nonTransferable";
  const { register, unregister } = useMintCreationForm();
  useEffect(() => {
    register(registrationField, { value: {} });
    return () => unregister(registrationField);
  }, [register, unregister]);
  return null;
}

export { NonTransferable };
