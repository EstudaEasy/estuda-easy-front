import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      "heading-big": "text-xl font-extrabold tracking-tight lg:text-5xl",
      "heading-1": "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      "heading-2": "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      "heading-3": "scroll-m-20 text-2xl font-semibold tracking-tight",
      "heading-4": "scroll-m-20 text-xl font-semibold tracking-tight",
      "body-1": "leading-7 [&:not(:first-child)]:mt-6",
      "body-2": "text-sm font-medium leading-none",
      caption: "text-sm text-muted-foreground",
    },
    color: {
      dark: "text-foreground",
      light: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-muted-foreground",
      white: "text-white",
      error: "text-destructive",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
  },
  defaultVariants: {
    variant: "body-1",
  },
});

export interface TypographyProps
  extends
    Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

const Typography = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, variant, color, weight, size, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(typographyVariants({ variant, color, weight, size, className }))}
        {...props}
      />
    );
  },
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
