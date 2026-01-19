import type { ErrorOption } from "react-hook-form";

function InputError({ error }: { error?: ErrorOption }) {
  if (!error) {
    return null;
  }
  return <p className="text-xs text-red-700">{error.message}</p>;
}

export { InputError };
