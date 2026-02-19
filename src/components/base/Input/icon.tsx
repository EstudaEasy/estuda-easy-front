import React from "react";
import { cn } from "@/lib/utils";
import { InputIconProps } from "./input.types";
import { COLOR_CLASSES } from "@/styles/variantClasses";

const InputIcon = React.forwardRef<HTMLSpanElement, InputIconProps>(
  ({ className, icon, position = "right", color = "dark", ...props }, ref) => {
    const colorClass = COLOR_CLASSES[color];
    if (!icon) return null;

    return (
      <span
        ref={ref}
        className={cn(
          `absolute top-1/2 -translate-y-1/2 flex items-center justify-center ${props.onClick ? "cursor-pointer" : "pointer-events-none"}`,
          position === "left" ? "left-3" : "right-3",
          colorClass,
          className,
        )}
        {...props}
      >
        {icon}
      </span>
    );
  },
);

InputIcon.displayName = "InputIcon";

export default InputIcon;
