"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { LuBrain, LuTimer, LuBookOpen, LuBook, LuX } from "react-icons/lu";
import { useActivities } from "@/hooks/useActivities";
import { formatTimeAgo, activityStorage } from "@/lib/activityStorage";
import LoadingState from "@/components/LoadingState";

const iconMap = {
  LuBrain: LuBrain,
  LuBookOpen: LuBookOpen,
  LuBook: LuBook,
  LuClock: LuTimer,
};

const getRouteByResourceType = (resourceType: string, resourceId: string): string => {
  const routes: Record<string, string> = {
    deck: `/tools/flashcards/${resourceId}`,
    task: `/tools/tasks`,
    quiz: `/tools/quiz/${resourceId}`,
    diary: `/tools/diary`,
    whiteboard: `/tools/whiteboard/${resourceId}`,
  };
  return routes[resourceType] || "/";
};

export default function ActivitySection() {
  const router = useRouter();
  const { activities, isLoading } = useActivities(50);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const deduplicatedActivities = Array.from(
    activities
      .reduce((map, item) => {
        const key = item.resourceId;
        const existing = map.get(key);

        if (!existing || item.timestamp > existing.timestamp) {
          map.set(key, item);
        }

        return map;
      }, new Map<string, (typeof activities)[0]>())
      .values(),
  )
    .filter((item) => !removedIds.has(item.id))
    .slice(0, 3);

  const handleActivityClick = (activity: (typeof activities)[0]) => {
    const route = getRouteByResourceType(activity.resourceType, activity.resourceId);
    router.push(route);
  };

  const handleRemoveActivity = (e: React.MouseEvent, activityId: string, resourceId: string) => {
    e.stopPropagation();
    activityStorage.removeActivity(resourceId);
    setRemovedIds((prev) => new Set([...prev, activityId]));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="heading-3" color="dark">
          Onde você parou
        </Typography>
        <Separator className="mt-2" />
      </div>

      {isLoading ? (
        <LoadingState message="Carregando atividades..." variant="inline" />
      ) : deduplicatedActivities.length === 0 ? (
        <div className="text-center py-8">
          <Typography color="light">Nenhuma atividade registrada ainda</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {deduplicatedActivities.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || LuBrain;
            return (
              <Card
                key={item.id}
                className="flex flex-col gap-3 p-4 cursor-pointer hover:shadow-md hover:bg-slate-50 transition-all relative group"
                onClick={() => handleActivityClick(item)}
              >
                <button
                  onClick={(e) => handleRemoveActivity(e, item.id, item.resourceId)}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  title="Remover dos recentes"
                >
                  <LuX size={16} />
                </button>
                <div className="flex items-start justify-between">
                  <div className={`shrink-0 p-2 rounded-md ${item.iconClass}`}>
                    <IconComponent size={18} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.tool}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <Typography size="sm" weight="bold" color="dark" className="line-clamp-2">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="light" className="flex items-center gap-1">
                    <LuTimer size={12} />
                    {formatTimeAgo(item.timestamp)}
                  </Typography>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
