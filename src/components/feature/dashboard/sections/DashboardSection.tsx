import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

const stats = [
  { value: 12, label: "Dias seguidos", highlight: true },
  { value: 47, label: "Tarefas", highlight: false },
  { value: "8h", label: "Esta semana", highlight: false },
];

export default function DashboardSection() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="heading-3" color="dark">
          Minhas Estatísticas
        </Typography>
        <Separator className="mt-2" />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className={stat.highlight ? "bg-emphasis rounded-2xl" : "rounded-2xl"}>
            <CardContent className="flex flex-col gap-2 py-5">
              <Typography variant={"heading-big"} color={stat.highlight ? "white" : "dark"}>
                {stat.value}
              </Typography>
              <Typography size="xl" weight="normal" color={stat.highlight ? "white" : "dark"}>
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
