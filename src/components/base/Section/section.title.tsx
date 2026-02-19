import * as React from "react";
import Typography from "../Typography";
import { SectionTitleProps } from "./section.types";

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ variant = "heading-2", color = "dark", as = "h2", children, ...props }, ref) => (
    <Typography
      ref={ref as React.ForwardedRef<HTMLElement>}
      variant={variant}
      color={color}
      as={as}
      {...props}
    >
      {children}
    </Typography>
  ),
);

SectionTitle.displayName = "SectionTitle";

export default SectionTitle;
