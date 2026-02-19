import React from "react";
import { cn } from "@/lib/utils";
import { InputGroupProps } from "./input.types";

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, error, helperText, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1 w-full", className)} {...props}>
        {children}
        {error && (
          <span className="text-xs text-red-600 mt-1" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && <span className="text-xs text-gray-500 mt-1">{helperText}</span>}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";

export default InputGroup;
