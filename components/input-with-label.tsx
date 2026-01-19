"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CircleXIcon, RefreshCwIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type RegsiteredFields,
  useMintCreationForm,
} from "./providers/token-creation-form";
import { InputError } from "./ui/input-error";
import { ErrorOption } from "react-hook-form";
import { useEffect } from "react";
import { Description } from "./ui/description";

type InputWithLabelProps = React.ComponentProps<typeof InputGroupInput> & {
  label: string;
  registrationField: RegsiteredFields;
} & (
    | {
        type?: "text";
        defaultValue: string;
      }
    | {
        type?: "number";
        defaultValue: number;
      }
  );
function InputWithLabel({
  label,
  registrationField,
  type = "text",
  defaultValue,
  ...props
}: InputWithLabelProps) {
  const {
    register,
    setValue,
    unregister,
    trigger: triggerValidation,
    formState,
  } = useMintCreationForm();
  const clearInput = () => {
    setValue(registrationField, "");
    triggerValidation(registrationField);
  };

  let error = formState.errors;
  registrationField.split(".").forEach((eachField) => {
    error = error?.[eachField];
  });

  useEffect(() => {
    return () => unregister(registrationField);
  }, []);
  return (
    <div className="mb-">
      <Label htmlFor={registrationField}>{label}</Label>
      <Description>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam numquam
        facere, cumque impedit ad quod. Molestiae quis accusamus delectus odit!
      </Description>
      <InputGroup>
        <InputGroupInput
          id={registrationField}
          type={type}
          {...props}
          {...register(registrationField, {
            valueAsNumber: type === "text" ? false : true,
            value: defaultValue,
          })}
        />
        {type === "text" && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={clearInput}>
              <CircleXIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <InputError error={error as undefined | ErrorOption} />
    </div>
  );
}

export { InputWithLabel };
