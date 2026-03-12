import * as React from "react";
import { useState } from "react";
import { LuClipboardList, LuStar } from "react-icons/lu";
import { QuizCardProps } from "./quizCard.types";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { activityStorage } from "@/lib/activityStorage";
import { favoriteStorage } from "@/lib/favoriteStorage";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const QuizCard = React.forwardRef<HTMLDivElement, QuizCardProps>(
  ({ title, questionsCount, onClick, className }, ref) => {
    const { isFavorite } = useFavorites();
    const [isFav, setIsFav] = useState(isFavorite(title, "Quiz"));

    const handleClick = () => {
      activityStorage.addActivity({
        id: title,
        title: title,
        tool: "Quiz",
        icon: "LuBrain",
        iconClass: "bg-purple-100 text-purple-600",
      });
      onClick?.();
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isFav) {
        favoriteStorage.removeFavorite(title, "Quiz");
        toast.success("Removido dos favoritos");
      } else {
        favoriteStorage.addFavorite({
          id: title,
          title: title,
          tool: "Quiz",
          icon: "LuBrain",
          iconClass: "bg-purple-100 text-purple-600",
          color: "bg-purple-500",
        });
        toast.success("Adicionado aos favoritos");
      }
      setIsFav(!isFav);
    };

    return (
      <Card
        ref={ref}
        onClick={handleClick}
        className={cn("cursor-pointer transition-colors hover:bg-accent relative", className)}
      >
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LuClipboardList size={20} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <Typography variant="body-2" weight="semibold" color="dark">
              {title}
            </Typography>
            <Typography variant="caption" color="light">
              {questionsCount} {questionsCount === 1 ? "questão" : "questões"}
            </Typography>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <LuStar size={18} fill={isFav ? "currentColor" : "none"} className="text-yellow-500" />
          </button>
        </CardContent>
      </Card>
    );
  },
);

QuizCard.displayName = "QuizCard";

export default QuizCard;
