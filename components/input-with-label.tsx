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
  AllFieldPaths,
  useMintCreationForm,
} from "./providers/token-creation-form";
import { InputError } from "./ui/input-error";
import { ErrorOption } from "react-hook-form";
import { useEffect, useState } from "react";
import { Description } from "./ui/description";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Switch } from "./ui/switch";

type InputWithLabelProps = React.ComponentProps<typeof InputGroupInput> & {
  label: string;
  registrationField: AllFieldPaths;
  optional?: boolean;
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

function InputWithLabel({ optional, label, ...props }: InputWithLabelProps) {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <Field>
      <div className="flex gap-2 items-center">
        <FieldLabel htmlFor={props.registrationField} className="">
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
      {isVisible && <InputLabel {...props} />}
    </Field>
  );
}

function InputLabel({
  registrationField,
  type = "text",
  defaultValue,
  ...props
}: Omit<InputWithLabelProps, "label" | "optional">) {
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
