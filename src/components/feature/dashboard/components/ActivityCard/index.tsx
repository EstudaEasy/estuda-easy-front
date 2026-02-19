import * as React from "react";
import { ActivityCardProps } from "./activityCard.types";
import { Card, CardContent, CardHeader, Typography } from "@/components/base";
import CardIcon from "@/components/base/Card/card.icon";
import { LuTimer } from "react-icons/lu";
import { cn } from "@/lib/utils";

const ActivityCard = React.forwardRef<HTMLDivElement, ActivityCardProps>(
  (
    {
      title,
      type,
      timeAgo,
      icon,
      iconVariant = "rounded-md",
      iconBackgroundColor = "bg-primary",
      iconColor = "white",
      className,
    },
    ref,
  ) => (
    <Card ref={ref} className={cn("flex gap-2 bg-white w-1/2 items-center py-0", className)}>
      <CardHeader>
        <CardIcon
          icon={icon}
          variant={iconVariant}
          backgroundColor={iconBackgroundColor}
          color={iconColor}
        />
      </CardHeader>
      <CardContent className="px-0 items-center justify-center">
        <div className="flex flex-col gap-1">
          <div className="w-full">
            <Typography size="xl" weight="bold" color="dark">
              {title}
            </Typography>
          </div>
          <div className="flex items-center">
            <Typography
              size="lg"
              weight="normal"
              color="light"
              className="flex items-center justify-center"
            >
              {type} •
              <span className="flex items-center gap-1 ml-2">
                <LuTimer size={16} /> {timeAgo}
              </span>
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
);

ActivityCard.displayName = "ActivityCard";

export default ActivityCard;
