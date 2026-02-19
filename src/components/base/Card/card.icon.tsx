import React from "react";
import { CARD_ICON_VARIANTS, CardIconProps } from "./card.types";
import { cn } from "@/lib/utils";
import * as LuIcons from "react-icons/lu";
import { COLOR_CLASSES, FONT_SIZE_CLASSES } from "@/styles/variantClasses";

const CardIcon = React.forwardRef<HTMLDivElement, CardIconProps>(
  ({ backgroundColor, color, className, icon, variant = "square-md", iconSize = "2xl" }, ref) => {
    const variantClass = CARD_ICON_VARIANTS[variant];
    const iconSizeClass = FONT_SIZE_CLASSES[iconSize];

    const IconComponent = (LuIcons as Record<string, React.ComponentType>)[icon];

    if (!IconComponent) {
      console.warn(`Icon "${icon}" não encontrado na biblioteca react-icons/lu`);
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          variantClass,
          backgroundColor,
          color && COLOR_CLASSES[color],
          iconSizeClass,
          className,
        )}
      >
        <IconComponent />
      </div>
    );
  },
);
CardIcon.displayName = "CardIcon";

export default CardIcon;
