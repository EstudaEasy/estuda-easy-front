import * as React from "react";
import { useState } from "react";
import { LuBook, LuEllipsisVertical } from "react-icons/lu";
import { FlashcardCardProps } from "./flashcardCard.types";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { activityStorage } from "@/lib/activityStorage";
import { cn } from "@/lib/utils";

const FlashcardCard = React.forwardRef<HTMLDivElement, FlashcardCardProps>(
  ({ title, cardsCount, onClick, className, deck, onEdit, onDelete, onShare }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit && deck) {
        onEdit(deck);
        setIsMenuOpen(false);
      }
    };

    const handleShareClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onShare && deck) {
        onShare(deck);
        setIsMenuOpen(false);
      }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    };

    const handleCardClick = () => {
      activityStorage.addActivity({
        title: title,
        tool: "Flashcards",
        icon: "LuBookOpen",
        iconClass: "bg-green-100 text-green-600",
        resourceId: deck?.id || "",
        resourceType: "deck",
      });
      onClick?.();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete && deck) {
        activityStorage.removeActivity(deck.id);
        onDelete(deck);
        setIsMenuOpen(false);
      }
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

          {(onEdit || onDelete || onShare) && (
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
                  {onShare && (
                    <button
                      onClick={handleShareClick}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium border-b border-slate-100 transition-colors"
                    >
                      Compartilhar
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium border-b border-slate-100 transition-colors"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDeleteClick}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors"
                    >
                      Deletar
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
