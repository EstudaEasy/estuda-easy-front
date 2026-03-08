import {
  TypographVariant,
  ColorVariant,
  FontSizeVariant,
  FontWeightVariant,
  RoundedVariant,
} from "./variants";

export const TYPOGRAPH_CLASSES: Record<TypographVariant, string> = {
  "heading-big": "text-6xl font-extrabold",
  "heading-xl": "text-5xl font-extrabold",
  "heading-1": "text-4xl font-bold",
  "heading-2": "text-3xl font-bold",
  "heading-3": "text-2xl font-bold",
  "body-1": "text-base font-normal",
  "body-2": "text-sm font-normal",
  title: "text-lg font-semibold",
  subtitle: "text-md font-medium",
  caption: "text-xs font-normal",
  small: "text-xs font-light",
  muted: "text-sm font-light text-muted",
};

export const COLOR_CLASSES: Record<ColorVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  emphasis: "text-emphasis",
  danger: "text-red-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
  light: "text-gray-300",
  dark: "text-gray-900",
  white: "text-white",
  purple: "text-purple",
  "washed-blue": "text-washed-blue",
  "primary-hover": "text-primary-hover",
  "primary-background": "text-primary-background",
};

export const FONT_SIZE_CLASSES: Record<FontSizeVariant, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
};

export const FONT_WEIGHT_CLASSES: Record<FontWeightVariant, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

export const ROUNDED_CLASSES: Record<RoundedVariant, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};
