"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { LuBrain, LuBookOpen, LuBook, LuClock, LuX } from "react-icons/lu";
import { useFavorites } from "@/hooks/useFavorites";

const iconMap = {
  LuBrain: LuBrain,
  LuBookOpen: LuBookOpen,
  LuBook: LuBook,
  LuClock: LuClock,
};

const toolRoutes = {
  Quiz: "/tools/quiz",
  Flashcards: "/tools/flashcards",
  Tarefas: "/tools/tasks",
  Pomodoro: "/tools/pomodoro",
};

export default function DashboardSection() {
  const { favorites, removeFavorite, isLoading } = useFavorites();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="heading-3" color="dark">
          Seus Favoritos
        </Typography>
        <Separator className="mt-2" />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Typography color="light">Carregando favoritos...</Typography>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8">
          <Typography color="light">Nenhum favorito adicionado ainda</Typography>
          <Typography size="sm" color="light" className="mt-2">
            Clique no ícone de estrela ao acessar seus itens favoritos
          </Typography>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const IconComponent = iconMap[favorite.icon as keyof typeof iconMap] || LuBrain;
            const link = toolRoutes[favorite.tool as keyof typeof toolRoutes] || "#";

            return (
              <Link key={`${favorite.id}-${favorite.tool}`} href={link}>
                <Card className="rounded-xl hover:shadow-md transition-shadow h-full cursor-pointer">
                  <CardContent className="flex flex-col gap-3 py-4">
                    <div className="flex items-start justify-between">
                      <div className={`${favorite.color} p-2 rounded-md text-white`}>
                        <IconComponent size={18} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFavorite(favorite.id, favorite.tool);
                        }}
                        className="p-1 hover:bg-red-50 rounded transition-colors text-red-500"
                        title="Remover dos favoritos"
                      >
                        <LuX size={16} />
                      </button>
                    </div>
                    <div>
                      <Typography size="sm" weight="bold" color="dark">
                        {favorite.title}
                      </Typography>
                      <Typography size="xs" color="light" className="mt-1">
                        {favorite.tool}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
