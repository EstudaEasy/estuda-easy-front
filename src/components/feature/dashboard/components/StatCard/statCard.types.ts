import { BackgroundColorVariant, ColorVariant } from "@/styles/variants";

export interface StatCardProps {
  value: number | string;
  label: string;
  bgColor?: BackgroundColorVariant;
  textColor?: ColorVariant;
  size?: "sm" | "md" | "lg";
}
