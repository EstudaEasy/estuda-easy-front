import * as React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "./card.types";

const cardSizeClasses = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ size = "md", className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground py-3",
        cardSizeClasses[size],
        className,
      )}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";

export default Card;
