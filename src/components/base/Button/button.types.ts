import { RoundedVariant, SizeVariant } from "@/styles/variants";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "white"
  | "purple"
  | "washed-blue"
  | "outline";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover hover:text-black",
  secondary: "bg-gray-600 text-white hover:bg-gray-500 hover:text-white",
  tertiary: "bg-transparent text-primary hover:bg-primary hover:text-white",
  danger: "bg-red text-white hover:bg-red-opacity hover:text-red",
  success: "bg-green text-white hover:bg-green-opacity hover:text-green",
  warning: "bg-yellow-500 text-white hover:bg-yellow-400 hover:text-white",
  info: "bg-blue-500 text-white hover:bg-blue-400 hover:text-white",
  light: "bg-gray-200 text-dark hover:bg-gray-300 hover:text-dark",
  dark: "bg-gray-900 text-white hover:bg-gray-800 hover:text-white",
  white: "bg-white text-dark hover:bg-gray-100 hover:text-dark",
  purple: "bg-purple text-white hover:bg-purple-opacity hover:text-purple",
  "washed-blue": "bg-washed-blue text-white hover:bg-washed-blue-opacity hover:text-washed-blue",
  outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
};

export const BUTTON_SIZE_CLASSES: Record<SizeVariant, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
  full: "px-3 py-2 w-full",
};

export const BUTTON_ROUNDED_CLASSES: Record<RoundedVariant, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant: ButtonVariant;
  size?: SizeVariant;
  rounded?: RoundedVariant;
}
