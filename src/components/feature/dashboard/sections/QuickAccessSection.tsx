import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/base";
import { QuickAccessCard, QuickAccessCardProps } from "../components";

export default function QuickAccessSection() {
  const quickAccessItems: QuickAccessCardProps[] = [
    {
      title: "Tarefas",
      description: "Gerencie suas tarefas",
      icon: "LuBook",
      backgroundColor: "bg-primary-background",
      iconBackgroundColor: "bg-primary",
      color: "white",
      href: "/tools/tasks",
    },
    {
      title: "Pomodoro",
      description: "Comece uma sessão de estudo",
      icon: "LuClock",
      backgroundColor: "bg-red-opacity",
      iconBackgroundColor: "bg-red",
      color: "white",
      href: "/tools/pomodoro",
    },
    {
      title: "Flashcards",
      description: "Revise seus cards",
      icon: "LuBookOpen",
      backgroundColor: "bg-green-opacity",
      iconBackgroundColor: "bg-green",
      color: "white",
      href: "/tools/flashcards",
    },
    {
      title: "Quiz",
      description: "Teste seus conhecimentos",
      icon: "LuBrain",
      backgroundColor: "bg-purple-opacity",
      iconBackgroundColor: "bg-purple",
      color: "white",
      href: "/tools/quiz",
    },
  ];

  return (
    <Section defaultOpen={true} className="px-0">
      <SectionHeader>
        <SectionTitle>Acesso rápido</SectionTitle>
        <SectionDescription></SectionDescription>
      </SectionHeader>

      <SectionContent className="flex gap-2">
        {quickAccessItems.map((item, index) => (
          <QuickAccessCard key={index} {...item} />
        ))}
      </SectionContent>
    </Section>
  );
}
