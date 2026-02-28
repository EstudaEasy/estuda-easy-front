import * as React from "react";
import { LuClipboardList } from "react-icons/lu";
import { QuizCardProps } from "./quizCard.types";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const QuizCard = React.forwardRef<HTMLDivElement, QuizCardProps>(
  ({ title, questionsCount, onClick, className }, ref) => (
    <Card
      ref={ref}
      onClick={onClick}
      className={cn("cursor-pointer transition-colors hover:bg-accent", className)}
    >
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <LuClipboardList size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <Typography variant="body-2" weight="semibold" color="dark">
            {title}
          </Typography>
          <Typography variant="caption" color="light">
            {questionsCount} {questionsCount === 1 ? "questão" : "questões"}
          </Typography>
        </div>
      </CardContent>
    </Card>
  ),
);

QuizCard.displayName = "QuizCard";

export default QuizCard;
