import * as React from "react";
import { useState } from "react";
import { FileText } from "lucide-react";
import { LuEllipsisVertical } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { activityStorage } from "@/lib/activityStorage";
import { WhiteboardCardProps } from "./whiteBoardCard.types";

const WhiteboardCard = React.forwardRef<HTMLDivElement, WhiteboardCardProps>(
  ({ title, createdAt, whiteboard, onClick, className, onEdit, onDelete, onShare }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit && whiteboard) {
        onEdit(whiteboard);
        setIsMenuOpen(false);
      }
    };

    const handleShareClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onShare && whiteboard) {
        onShare(whiteboard);
        setIsMenuOpen(false);
      }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete && whiteboard) {
        onDelete(whiteboard);
        setIsMenuOpen(false);
      }
    };

    const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const handleClick = () => {
      activityStorage.addActivity({
        title: title,
        tool: "WhiteBoard",
        icon: "LuBrain",
        iconClass: "bg-blue-100 text-blue-600",
        resourceId: whiteboard?.id,
        resourceType: "whiteboard",
      });
      onClick?.();
    };

    return (
      <Card
        ref={ref}
        onClick={handleClick}
        className={cn("cursor-pointer transition-colors hover:bg-accent relative", className)}
      >
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText size={20} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <Typography variant="body-2" weight="semibold" color="dark">
              {title}
            </Typography>
            <Typography variant="caption" color="light">
              Criado em {formattedDate}
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
                <div className="absolute right-0 top-full z-50 mt-1 min-w-37.5 rounded-lg border border-slate-200 bg-white shadow-md">
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

WhiteboardCard.displayName = "WhiteboardCard";

export default WhiteboardCard;
