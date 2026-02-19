import { cn } from "@/lib/utils";
import React from "react";
import {
  BUTTON_ROUNDED_CLASSES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
  ButtonProps,
} from "./button.types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, size = "lg", rounded = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "cursor-pointer transition-all duration-200 ease inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500",
        BUTTON_VARIANT_CLASSES[variant],
        BUTTON_SIZE_CLASSES[size],
        BUTTON_ROUNDED_CLASSES[rounded],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
export default Button;
