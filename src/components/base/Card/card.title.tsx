import * as React from "react";
import Typography from "../Typography";
import { CardTitleProps } from "./card.types";

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ variant = "heading-3", color, as = "h3", children, ...props }, ref) => (
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

CardTitle.displayName = "CardTitle";

export default CardTitle;
