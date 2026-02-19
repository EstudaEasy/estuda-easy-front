import { BackgroundColorVariant, ColorVariant, FontSizeVariant } from "@/styles/variants";

export interface QuickAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: string;
  iconSize?: FontSizeVariant;
  backgroundColor?: string;
  iconBackgroundColor?: BackgroundColorVariant;
  color?: ColorVariant;
}
