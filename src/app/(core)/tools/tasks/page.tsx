"use client";

import { useState } from "react";
import Page from "@/components/Page";
import ViewTasks from "@/components/ViewTasks/viewTasks";
import { CreateTaskModal } from "@/components/ViewTasks/components/CreateTaskModal";
import { useTasks } from "@/hooks/useTasks";

export default function Tasks() {
  const { selectedDate, setSelectedDate, tasks, refreshTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Page>
      <Page.Header
        title="Tasks"
        subtitle="Organize-se e otimize seu tempo com nosso gerenciador de tarefas!"
        showButton
        buttonText="Criar task"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <Page.Content>
        <ViewTasks
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          tasks={tasks}
          refreshTasks={refreshTasks}
          onCreateTask={() => setIsModalOpen(true)}
        />
      </Page.Content>

      <CreateTaskModal
        open={isModalOpen}
        selectedDate={selectedDate}
        onSuccess={refreshTasks}
        onOpenChange={setIsModalOpen}
      />
    </Page>
  );
}
