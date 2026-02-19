import * as React from "react";
import { StatCardProps } from "./statCard.types";
import { Card, CardContent, Typography } from "@/components/base";

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ value, label, bgColor = "bg-primary-hover", textColor = "dark", size = "lg" }, ref) => (
    <Card ref={ref} size={size} className={`${bgColor} rounded-2xl`}>
      <CardContent className="flex flex-col gap-2 py-5">
        <Typography size="6xl" weight="extrabold" color={textColor}>
          {value}
        </Typography>
        <Typography size="xl" weight="normal" color={textColor}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  ),
);

StatCard.displayName = "StatCard";

export default StatCard;
