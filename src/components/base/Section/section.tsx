import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionProps } from "./section.types";

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, defaultOpen = false, ...props }, ref) => {
    return (
      <section
        ref={ref}
        data-section-open={defaultOpen}
        className={cn("mb-2 w-full rounded-lg border bg-card px-3 py-2", className)}
        {...props}
      >
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";

export default Section;
