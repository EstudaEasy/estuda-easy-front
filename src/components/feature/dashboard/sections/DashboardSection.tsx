import {
  Section,
  SectionContent,
  SectionDescription,
  SectionDropdown,
  SectionHeader,
  SectionTitle,
} from "@/components/base";
import { StatCard } from "../components";

export default function DashboardSection() {
  return (
    <Section defaultOpen={true} className="px-0">
      <SectionHeader>
        <SectionTitle>Minhas Estatísticas</SectionTitle>
        <SectionDescription></SectionDescription>
        <SectionDropdown isOpen={false} />
      </SectionHeader>

      <SectionContent className="px-0">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard value={12} label="Dias seguidos" bgColor="bg-emphasis" textColor="white" />
          <StatCard value={47} label="Tarefas" />
          <StatCard value={"8h"} label="Esta semana" />
        </div>
      </SectionContent>
    </Section>
  );
}
