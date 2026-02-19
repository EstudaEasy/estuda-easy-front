import { ColorVariant } from "@/styles/variants";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

export interface InputIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
  position?: "left" | "right";
  color?: ColorVariant;
}

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
  helperText?: string;
}
