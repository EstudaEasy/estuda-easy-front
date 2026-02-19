import React from "react";
import { InputProps } from "./input.types";
import { cn } from "@/lib/utils";
import { Typography } from "../Typography";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <>
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-black",
            className,
          )}
          {...props}
        />
        <Typography size="xs" color="danger" className="mt-1">
          {error}
        </Typography>
      </>
    );
  },
);

Input.displayName = "Input";

export default Input;
