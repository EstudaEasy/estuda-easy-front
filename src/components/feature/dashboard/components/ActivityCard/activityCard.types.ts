import { BackgroundColorVariant, ColorVariant } from "@/styles/variants";
import { CardIconVariant } from "@/components/base/Card/card.types";

export interface ActivityCardProps {
  title: string;
  type: string;
  timeAgo: string;
  icon: string;
  iconVariant?: CardIconVariant;
  iconBackgroundColor?: BackgroundColorVariant;
  iconColor?: ColorVariant;
  className?: string;
}
