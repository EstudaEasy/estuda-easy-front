import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { LuBrain, LuTimer, LuVideo } from "react-icons/lu";

const activities = [
  {
    title: "Matemática básica",
    type: "Quiz",
    timeAgo: "há 2 horas",
    Icon: LuBrain,
    iconClass: "bg-purple-100 text-purple-600",
    badgeColor: "purple",
  },
  {
    title: "História do Brasil",
    type: "Vídeo-aula",
    timeAgo: "há 1 dia",
    Icon: LuVideo,
    iconClass: "bg-blue-100 text-blue-600",
    badgeColor: "blue",
  },
];

export default function ActivitySection() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="heading-3" color="dark">
          Volte para onde você parou
        </Typography>
        <Separator className="mt-2" />
      </div>

      <div className="flex gap-4">
        {activities.map((activity, i) => (
          <Card key={i} className="flex-1 flex flex-row items-center gap-4 px-4 py-4">
            <div className={`flex-shrink-0 p-3 rounded-md ${activity.iconClass}`}>
              <activity.Icon size={20} />
            </div>
            <CardContent className="p-0 flex flex-col gap-1">
              <Typography size="xl" weight="bold" color="dark" className="m-0">
                {activity.title}
              </Typography>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`bg-${activity.badgeColor}-100 text-${activity.badgeColor}-600`}
                >
                  {activity.type}
                </Badge>
                <Typography variant={"caption"} className="flex items-center gap-1">
                  <LuTimer size={13} />
                  {activity.timeAgo}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
