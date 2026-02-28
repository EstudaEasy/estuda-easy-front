"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { format, addMonths, subMonths, addDays, subDays, isSameDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TaskCard } from "./components/TaskCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CreateTaskModal } from "./components/CreateTaskModal";
import PageHeader from "../PageHeader";

export default function Tasks() {
  const { selectedDate, setSelectedDate, tasks, refreshTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = Array.from({ length: 17 }, (_, i) => addDays(subDays(selectedDate, 8), i));

  const handleNextMonth = () => {
    const nextMonthDate = startOfMonth(addMonths(selectedDate, 1));
    setSelectedDate(nextMonthDate);
  };

  const handlePrevMonth = () => {
    const prevMonthDate = startOfMonth(subMonths(selectedDate, 1));
    setSelectedDate(prevMonthDate);
  };

  return (
    <div className="relative min-h-screen">
      <PageHeader
        title="Minhas Tarefas"
        buttonText="Criar Tarefa"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <div className="flex flex-col gap-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Typography variant="body-1" color="light">
            Simplifique sua rotina. Gerencie pendências com facilidade e foque no que realmente
            importa.
          </Typography>

          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handlePrevMonth}
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </Button>
            <Typography
              weight="bold"
              className="min-w-[140px] text-center capitalize text-[#1A2E5A]"
            >
              {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
            </Typography>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleNextMonth}
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </header>

        <div className="flex justify-center w-full overflow-hidden">
          <div
            className="
              flex gap-4 overflow-x-auto py-2 scroll-smooth items-end
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            "
          >
            {days.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className="flex flex-col items-center gap-2 min-w-[50px] transition-all"
                >
                  <span className="text-xs uppercase text-gray-400 font-bold">
                    {format(day, "eee", { locale: ptBR }).charAt(0)}
                  </span>

                  <div
                    className={`w-10 h-12 flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-[#1A2E5A] text-white scale-110 shadow-md"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {format(day, "d")}
                  </div>

                  <div
                    className={`w-1 h-1 rounded-full ${isSelected ? "bg-[#1A2E5A]" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onRefresh={refreshTasks} />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CreateTaskModal
          selectedDate={selectedDate}
          onSuccess={refreshTasks}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
