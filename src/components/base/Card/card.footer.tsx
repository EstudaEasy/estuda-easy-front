import * as React from "react";
import { cn } from "@/lib/utils";
import { CardFooterProps } from "./card.types";

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)}>
      {children}
    </div>
  ),
);
CardFooter.displayName = "CardFooter";

export default CardFooter;
