import { FieldError } from "react-hook-form";
import {
  FormFields,
  RegsiteredFields,
} from "./components/providers/token-creation-form";

export function truncateAddress(address: string, n: number = 4) {
  return address.slice(0, n) + "..." + address.slice(address.length - n);
}
export function run<T>(fn: () => T): T {
  return fn();
}
export const toggle = (prev: boolean) => !prev;

// export const getError = (
//   errors: FormFields,
//   registrationField: RegsiteredFields
// ) => {

//   return error;
// };
