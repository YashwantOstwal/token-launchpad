"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CircleXIcon, WalletIcon } from "lucide-react";
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
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Switch } from "./ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const [isVisible, setIsVisible] = useState(true);
  return (
    <Field>
      <div className="flex gap-2 items-center">
        <FieldLabel htmlFor={registrationField} className="">
          {label}
        </FieldLabel>
        {optional && (
          <Switch
            onClick={() => setIsVisible((prev) => !prev)}
            checked={isVisible}
          />
        )}
      </div>

      <FieldDescription>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam numquam
        facere, cumque impedit ad quod. Molestiae quis accusamus delectus odit!
      </FieldDescription>
      {isVisible && (
        <InputAddress
          placeholder={placeholder}
          registrationField={registrationField}
        />
      )}
    </Field>
  );
}

function InputAddress({
  registrationField,
  placeholder,
}: {
  registrationField: AllFieldPaths;
  placeholder: string;
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
  );

  const { onChange, ...inputProps } = register(registrationField, {
    disabled: false,
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
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton
                variant="outline"
                className={cn(isValueWalletAddress && "bg-secondary")}
                onClick={toggleIsValueWalletAddressAndUpdateInput}
                disabled={isLoading}
              >
                <WalletIcon
                  className={cn(
                    "hover:text-accent-foreground  transition-colors",
                    isValueWalletAddress && "text-accent-foreground",
                  )}
                ></WalletIcon>
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>Sync with connected wallet addre</TooltipContent>
          </Tooltip>
          <InputGroupButton
            variant="outline"
            className="transition-colors"
            onClick={clearInput}
          >
            <CircleXIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputError error={error as undefined | ErrorOption} />
    </div>
  );
}
export { InputAsAddress };
