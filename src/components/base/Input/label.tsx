import React from "react";
import { cn } from "@/lib/utils";

const InputLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium text-gray-700 mb-1 block", className)}
        {...props}
      >
        {children}
      </label>
    );
  },
);

InputLabel.displayName = "InputLabel";

export default InputLabel;
