import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { LuBook, LuBookOpen, LuBrain, LuClock } from "react-icons/lu";
import { cn } from "@/lib/utils";

const quickAccessItems = [
  {
    title: "Tarefas",
    description: "Gerencie suas tarefas",
    Icon: LuBook,
    href: "/tools/tasks",
    cardClass: "bg-primary/10",
    iconClass: "bg-primary text-white",
  },
  {
    title: "Pomodoro",
    description: "Comece uma sessão de estudo",
    Icon: LuClock,
    href: "/tools/pomodoro",
    cardClass: "bg-red-50",
    iconClass: "bg-red-500 text-white",
  },
  {
    title: "Flashcards",
    description: "Revise seus cards",
    Icon: LuBookOpen,
    href: "/tools/flashcards",
    cardClass: "bg-green-50",
    iconClass: "bg-green-500 text-white",
  },
  {
    title: "Quiz",
    description: "Teste seus conhecimentos",
    Icon: LuBrain,
    href: "/tools/quiz",
    cardClass: "bg-purple-50",
    iconClass: "bg-purple-500 text-white",
  },
];

export default function QuickAccessSection() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="heading-3" color="dark">
          Acesso rápido
        </Typography>
        <Separator className="mt-2" />
      </div>

      <div className="flex gap-2">
        {quickAccessItems.map((item, i) => (
          <Link key={i} href={item.href} className="flex-1">
            <Card
              className={cn(
                "h-full cursor-pointer transition-opacity hover:opacity-70 rounded-lg py-8",
                item.cardClass,
              )}
            >
              <CardContent className="flex flex-col gap-3">
                <div className={cn("w-fit rounded-md p-2", item.iconClass)}>
                  <item.Icon size={20} />
                </div>
                <Typography variant="heading-4" color="dark">
                  {item.title}
                </Typography>
                <Typography color="light" weight="normal" className="line-clamp-3">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
