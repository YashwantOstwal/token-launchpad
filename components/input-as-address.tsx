"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CircleXIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useInputAsAddress } from "@/hooks/use-input-as-address";
import {
  useMintCreationForm,
  type RegsiteredFields,
} from "./providers/token-creation-form";
import type { ErrorOption } from "react-hook-form";
import { useEffect } from "react";
import { InputError } from "./ui/input-error";
import { Description } from "./ui/description";
import { address } from "@solana/kit";

function InputAsAddress({
  label,
  placeholder,
  registrationField,
  disabledInput,
}: {
  label: string;
  placeholder: string;
  registrationField: RegsiteredFields;
  disabledInput?: boolean;
}) {
  const { register, unregister, setValue, formState, trigger } =
    useMintCreationForm();

  const {
    isLoading,
    clearInput,
    isValueWalletAddress,
    setIsValueWalletAddress,
    toggleIsValueWalletAddressAndUpdateInput,
  } = useInputAsAddress(
    (value) => setValue(registrationField, value),
    () => trigger(registrationField),
    disabledInput,
  );

  const { onChange, ...inputProps } = register(registrationField, {
    disabled: disabledInput,
    required: true,
  });

  let error = formState.errors;
  registrationField.split(".").forEach((eachField) => {
    error = error?.[eachField];
  });

  useEffect(() => {
    return () => unregister(registrationField);
  }, []);
  return (
    <div className="mb-5">
      <Label htmlFor={registrationField}>{label}</Label>
      <Description>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam numquam
        facere, cumque impedit ad quod. Molestiae quis accusamus delectus odit!
      </Description>
      <InputGroup>
        <InputGroupInput
          id={registrationField}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e);
            setIsValueWalletAddress(false);
          }}
          {...inputProps}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            className={cn(isValueWalletAddress && "bg-secondary")}
            onClick={toggleIsValueWalletAddressAndUpdateInput}
            disabled={isLoading}
          >
            <InputGroupText
              className={cn(
                "hover:text-accent-foreground  transition-colors",
                isValueWalletAddress && "text-accent-foreground",
              )}
            >
              Sync with wallet address
            </InputGroupText>
          </InputGroupButton>
          <InputGroupButton className="transition-colors" onClick={clearInput}>
            <CircleXIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputError error={error as undefined | ErrorOption} />
    </div>
  );
}

export { InputAsAddress };
