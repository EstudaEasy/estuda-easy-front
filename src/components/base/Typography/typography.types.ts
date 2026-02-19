import * as React from "react";
import {
  TypographVariant,
  ColorVariant,
  FontSizeVariant,
  FontWeightVariant,
} from "@/styles/variants";

export type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographVariant;
  color?: ColorVariant;
  size?: FontSizeVariant;
  weight?: FontWeightVariant;
  as?: TypographyElement;
  className?: string;
}
