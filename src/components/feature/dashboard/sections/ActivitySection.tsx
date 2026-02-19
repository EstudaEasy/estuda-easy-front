import {
  Section,
  SectionContent,
  SectionDescription,
  SectionDropdown,
  SectionHeader,
  SectionTitle,
} from "@/components/base";
import { ActivityCard } from "../components";

export default function ActivitySection() {
  return (
    <Section defaultOpen={true} className="px-0">
      <SectionHeader>
        <SectionTitle>Volte para onde você parou</SectionTitle>
        <SectionDescription></SectionDescription>
        <SectionDropdown isOpen={false} />
      </SectionHeader>

      <SectionContent className="flex gap-4">
        <ActivityCard
          title="Matemática básica"
          type="Quiz"
          timeAgo="há 2 horas"
          icon="LuBrain"
          iconBackgroundColor="bg-purple-opacity"
          iconColor="purple"
        />

        <ActivityCard
          title="História do Brasil"
          type="Vídeo-aula"
          timeAgo="há 1 dia"
          icon="LuVideo"
          iconBackgroundColor="bg-washed-blue-opacity"
          iconColor="washed-blue"
        />
      </SectionContent>
    </Section>
  );
}
