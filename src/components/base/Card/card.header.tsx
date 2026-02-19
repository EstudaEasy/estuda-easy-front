import * as React from "react";
import { cn } from "@/lib/utils";
import { CardHeaderProps } from "./card.types";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  ),
);
CardHeader.displayName = "CardHeader";

export default CardHeader;
