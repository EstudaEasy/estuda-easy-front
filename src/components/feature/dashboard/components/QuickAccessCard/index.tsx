import { Card, CardContent, CardHeader, Typography } from "@/components/base";
import React from "react";
import { QuickAccessCardProps } from "./quickAccessCard.types";
import { cn } from "@/lib/utils";
import CardIcon from "@/components/base/Card/card.icon";

const QuickAccessCard = React.forwardRef<HTMLDivElement, QuickAccessCardProps>(
  (
    { title, description, icon, iconSize = "2xl", backgroundColor, color, iconBackgroundColor },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn("flex-col items-start gap-4 bg-white rounded-lg py-8 w-1/4", backgroundColor)}
    >
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
    </Card>
  ),
);

QuickAccessCard.displayName = "QuickAccessCard";

export default QuickAccessCard;
