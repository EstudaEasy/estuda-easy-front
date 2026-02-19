import { Card, CardContent, CardHeader, Typography } from "@/components/base";
import React from "react";
import { QuickAccessCardProps } from "./quickAccessCard.types";
import { cn } from "@/lib/utils";
import CardIcon from "@/components/base/Card/card.icon";
import Link from "next/link";

const QuickAccessCard = React.forwardRef<HTMLDivElement, QuickAccessCardProps>(
  (
    {
      title,
      description,
      icon,
      iconSize = "2xl",
      backgroundColor,
      color,
      iconBackgroundColor,
      href,
    },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn(
        "cursor-pointer flex-col items-start gap-4 bg-white rounded-lg py-8 w-1/4",
        backgroundColor,
      )}
    >
      <Link href={href}>
        <CardHeader className="pt-0">
          <CardIcon
            icon={icon}
            variant="square-lg"
            backgroundColor={iconBackgroundColor}
            color={color}
            iconSize={iconSize}
            className="rounded-3xl"
          />
        </CardHeader>
        <CardContent>
          <Typography variant="heading-3" color="dark" className="mb-3">
            {title}
          </Typography>
          <Typography color="dark" weight="normal" size="base">
            {description}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  ),
);

QuickAccessCard.displayName = "QuickAccessCard";

export default QuickAccessCard;
