"use client";

import { useState } from "react";
import Page from "@/components/Page";
import ViewDiary from "@/components/ViewDiary/viewDiary";
import { CreateDiaryModal } from "@/components/ViewDiary/components/CreateDiaryModal";
import { useDiaries } from "@/hooks/useDiaries";

export default function DiaryPage() {
  const { selectedDate, setSelectedDate, diaries, refreshDiaries } = useDiaries();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Page>
      <Page.Header
        title="Diário"
        subtitle="Um espaço totalmente reservado para você guardar o que aprendeu hoje."
        showButton
        buttonText="Adicionar pensamento"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <Page.Content>
        <ViewDiary
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          diaries={diaries}
          refreshDiaries={refreshDiaries}
          onCreateDiary={() => setIsModalOpen(true)}
        />
      </Page.Content>

      <CreateDiaryModal
        open={isModalOpen}
        selectedDate={selectedDate}
        onSuccess={refreshDiaries}
        onOpenChange={setIsModalOpen}
      />
    </Page>
  );
}
