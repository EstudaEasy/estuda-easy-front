import * as React from "react";
import { useState } from "react";
import { LuBook, LuEllipsisVertical, LuStar } from "react-icons/lu";
import { FlashcardCardProps } from "./flashcardCard.types";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { activityStorage } from "@/lib/activityStorage";
import { favoriteStorage } from "@/lib/favoriteStorage";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FlashcardCard = React.forwardRef<HTMLDivElement, FlashcardCardProps>(
  ({ title, cardsCount, onClick, className, deck, onEdit, onDelete }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isFavorite } = useFavorites();
    const [isFav, setIsFav] = useState(isFavorite(deck?.id || title, "Flashcards"));

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit && deck) {
        onEdit(deck);
        setIsMenuOpen(false);
      }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    };

    const handleCardClick = () => {
      activityStorage.addActivity({
        id: deck?.id || title,
        title: title,
        tool: "Flashcards",
        icon: "LuBookOpen",
        iconClass: "bg-green-100 text-green-600",
      });
      onClick?.();
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();

      const id = deck?.id || title;
      if (isFav) {
        favoriteStorage.removeFavorite(id, "Flashcards");
        toast.success("Removido dos favoritos");
      } else {
        favoriteStorage.addFavorite({
          id: id,
          title: title,
          tool: "Flashcards",
          icon: "LuBookOpen",
          iconClass: "bg-green-100 text-green-600",
          color: "bg-green-500",
        });
        toast.success("Adicionado aos favoritos");
      }
      setIsFav(!isFav);
    };

    return (
      <Card
        ref={ref}
        onClick={handleCardClick}
        className={cn("cursor-pointer transition-colors hover:bg-accent relative", className)}
      >
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LuBook size={20} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <Typography variant="body-2" weight="semibold" color="dark">
              {title}
            </Typography>
            <Typography variant="caption" color="light">
              {cardsCount} {cardsCount === 1 ? "carta" : "cartas"}
            </Typography>
          </div>

          <button
            onClick={handleToggleFavorite}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <LuStar size={18} fill={isFav ? "currentColor" : "none"} className="text-yellow-500" />
          </button>

          {(onEdit || onDelete) && (
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                title="Menu"
              >
                <LuEllipsisVertical size={18} className="text-slate-600" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-md z-50 min-w-[150px]">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium border-b border-slate-100 transition-colors"
                    >
                      Editar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

FlashcardCard.displayName = "FlashcardCard";

export default FlashcardCard;
