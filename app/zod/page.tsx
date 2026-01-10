"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { generateKeyPairSigner } from "@solana/kit";
import { MintCloseAuthority } from "@/components/extensions/mint-close-authority";

interface FormFields {
  lorem: string;
  base: {
    mintAuthority: string;
    freezeAuthority: string;
  };
}

function Page() {
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const {
    register,
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
    unregister,
    setValue,
  } = useForm<FormFields>({
    defaultValues: {
      // basemintAuthority:''
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setValue("base.mintAuthority", "loremloremlorem"); //important to update the mint Address on
      // reload or changing it with wallet if input value is wallet address.
    };
    fn();
  }, []);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="h-screen bg-red-100 flex flex-col items-center justify-center"
      >
        <div className="p-5">
          <input
            {...register("base.mintAuthority", {
              required: "Required field",
              validate: (value: string) => {
                if (value.length < 8) {
                  return "It must be a valid address";
                }
                return true;
              },
              disabled: state,
            })}
            type="text"
            className="p-1 border border-black"
          />
          {errors.base?.mintAuthority && (
            <p className="text-red-400">{errors.base?.mintAuthority.message}</p>
          )}
        </div>
        <div className="p-5">
          <input
            {...register("base.freezeAuthority", {
              validate: (value) => {
                if (value.length > 3) {
                  return true;
                } else {
                  return "must be greater than 3";
                }
              },
              disabled: state,
            })}
            type="string"
            className="p-1 border border-black"
          />
          {!state && errors.base?.freezeAuthority && (
            <p className="text-red-400">
              {errors.base.freezeAuthority.message}
            </p>
          )}

          {state2 && (
            <>
              <input
                {...register("lorem", {
                  validate: (value) => {
                    if (value.length > 3) {
                      return true;
                    } else {
                      return "must be greater than 3";
                    }
                  },
                  disabled: state,
                })}
                type="string"
                className="p-1 border border-black"
              />
              {!state && errors.lorem && (
                <p className="text-red-400">{errors.lorem.message}</p>
              )}
            </>
          )}
        </div>
        <button
          disabled={isSubmitting}
          className="disabled:bg-red-400"
          type="submit"
        >
          Click to submit
        </button>
        {errors.root && errors.root.message}
      </form>
      <button onClick={() => setState((prev) => !prev)}>Click to toggle</button>
      <button
        onClick={() => {
          unregister("lorem"); //to be unregistered
          setState2((prev) => !prev);
        }}
      >
        Click to toggle
      </button>
    </>
  );
}

export default Page;
