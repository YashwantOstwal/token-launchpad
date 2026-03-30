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
  AllFieldPaths,
  useMintCreationForm,
} from "./providers/token-creation-form";
import type { ErrorOption } from "react-hook-form";
import { useEffect, useState } from "react";
import { InputError } from "./ui/input-error";
import { Description } from "./ui/description";
import { address } from "@solana/kit";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Switch } from "./ui/switch";

function InputAsAddress({
  label,
  placeholder,
  registrationField,
  optional = false,
}: {
  label: string;
  placeholder: string;
  registrationField: AllFieldPaths;
  optional?: boolean;
}) {
  const [isNullable, setIsNullable] = useState(false);
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
    optional && isNullable,
  );

  const { onChange, ...inputProps } = register(registrationField, {
    disabled: optional && isNullable,
    required: true,
  });

  let error = formState.errors;
  registrationField.split(".").forEach((eachField) => {
    //@ts-expect-error
    error = error?.[eachField];
  });

  useEffect(() => {
    return () => unregister(registrationField);
  }, []);

  return (
    <Field>
      <div className="flex gap-2 items-center">
        <FieldLabel htmlFor={registrationField} className="">
          {label}
        </FieldLabel>
        {optional && (
          <Switch
            onClick={() =>
              setIsNullable((prev) => {
                return !prev;
              })
            }
            checked={!isNullable}
          />
        )}
      </div>

      <FieldDescription>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam numquam
        facere, cumque impedit ad quod. Molestiae quis accusamus delectus odit!
      </FieldDescription>
      <div>
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
                sync with wallet
              </InputGroupText>
            </InputGroupButton>
            <InputGroupButton
              className="transition-colors"
              onClick={clearInput}
            >
              <CircleXIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputError error={error as undefined | ErrorOption} />
      </div>
    </Field>
  );
}

export { InputAsAddress };
