"use client";

import { useState } from "react";
import Page from "@/components/Page";
import ViewTasks from "@/components/ViewTasks/viewTasks";
import { CreateTaskModal } from "@/components/ViewTasks/components/CreateTaskModal";
import { useTasks } from "@/hooks/useTasks";

export default function Tasks() {
  const { selectedDate, refreshTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Page>
      <Page.Header
        title="Tarefas"
        subtitle="Organize suas tarefas e otimize seu tempo com nosso gerenciador de tarefas eficiente!"
        showButton
        buttonText="Criar tarefa"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <Page.Content>
        <ViewTasks />
      </Page.Content>

      {isModalOpen && (
        <CreateTaskModal
          selectedDate={selectedDate}
          onSuccess={refreshTasks}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Page>
  );
}
