"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { LuBrain, LuTimer, LuBookOpen, LuBook } from "react-icons/lu";
import { useActivities } from "@/hooks/useActivities";
import { formatTimeAgo } from "@/lib/activityStorage";

const iconMap = {
  LuBrain: LuBrain,
  LuBookOpen: LuBookOpen,
  LuBook: LuBook,
  LuClock: LuTimer,
};

export default function ActivitySection() {
  const { activities, isLoading } = useActivities(50);

  // Deduplicar atividades: manter apenas a mais recente de cada título
  const deduplicatedActivities = Array.from(
    activities
      .reduce((map, item) => {
        const key = `${item.title}-${item.tool}`;
        const existing = map.get(key);

        // Se não existe ou a nova é mais recente, sobrescrever
        if (!existing || item.timestamp > existing.timestamp) {
          map.set(key, item);
        }

        return map;
      }, new Map<string, (typeof activities)[0]>())
      .values(),
  ).slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="heading-3" color="dark">
          Onde você parou
        </Typography>
        <Separator className="mt-2" />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Typography color="light">Carregando atividades...</Typography>
        </div>
      ) : deduplicatedActivities.length === 0 ? (
        <div className="text-center py-8">
          <Typography color="light">Nenhuma atividade registrada ainda</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {deduplicatedActivities.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || LuBrain;
            return (
              <Card key={item.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between">
                  <div className={`flex-shrink-0 p-2 rounded-md ${item.iconClass}`}>
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
