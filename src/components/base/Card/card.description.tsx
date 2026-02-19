import * as React from "react";
import Typography from "../Typography";
import { CardDescriptionProps } from "./card.types";

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ variant = "body-2", color, as = "p", children, ...props }, ref) => (
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

CardDescription.displayName = "CardDescription";

export default CardDescription;
