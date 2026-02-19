import * as React from "react";
import { cn } from "@/lib/utils";
import {
  TYPOGRAPH_CLASSES,
  COLOR_CLASSES,
  FONT_SIZE_CLASSES,
  FONT_WEIGHT_CLASSES,
} from "@/styles/variantClasses";
import { TypographyProps } from "./typography.types";

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = "body-1",
      color,
      size,
      weight,
      as: Component = "p",
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const variantClass = variant ? TYPOGRAPH_CLASSES[variant] : "";
    const colorClass = color ? COLOR_CLASSES[color] : "";
    const sizeClass = size ? FONT_SIZE_CLASSES[size] : "";
    const weightClass = weight ? FONT_WEIGHT_CLASSES[weight] : "";

    return React.createElement(
      Component,
      {
        ref,
        className: cn(variantClass, colorClass, sizeClass, weightClass, className),
        ...props,
      },
      children,
    );
  },
);

Typography.displayName = "Typography";

export { Typography };
export default Typography;
export type { TypographyProps, TypographyElement } from "./typography.types";
