import * as React from "react";
import { cn } from "@/lib/utils";
import { CardContentProps } from "./card.types";

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("p-6 py-0", className)}>
      {children}
    </div>
  ),
);
CardContent.displayName = "CardContent";

export default CardContent;
