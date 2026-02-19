import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionContentProps } from "./section.types";

const SectionContent = React.forwardRef<HTMLDivElement, SectionContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mt-4 overflow-hidden transition-all duration-200",
          "section-content",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SectionContent.displayName = "SectionContent";

export default SectionContent;
