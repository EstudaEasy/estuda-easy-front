import React from "react";
import { SectionHeaderProps } from "./section.types";
import { cn } from "@/lib/utils";

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "mb-4 w-full grid gap-1",
          "grid-cols-[1fr_auto] grid-rows-[auto_auto]",
          "[&>*:nth-child(1)]:col-start-1 [&>*:nth-child(1)]:row-start-1",
          "[&>*:nth-child(2)]:col-start-1 [&>*:nth-child(2)]:row-start-2",
          "[&>*:last-child]:col-start-2 [&>*:last-child]:row-span-2 [&>*:last-child]:self-center",
          className,
        )}
        {...props}
      >
        {children}
      </header>
    );
  },
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
