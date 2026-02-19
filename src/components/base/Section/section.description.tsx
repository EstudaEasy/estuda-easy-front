import * as React from "react";
import Typography from "../Typography";
import { SectionDescriptionProps } from "./section.types";

const SectionDescription = React.forwardRef<HTMLParagraphElement, SectionDescriptionProps>(
  ({ variant = "body-2", color = "dark", as = "p", children, ...props }, ref) => (
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

SectionDescription.displayName = "SectionDescription";

export default SectionDescription;
