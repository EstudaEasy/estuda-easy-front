"use client";

import { useState } from "react"; //
import { Typography } from "@/components/base/Typography";
import { useTasks } from "@/hooks/useTasks";
import { format, addMonths, subMonths, addDays, subDays, isSameDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TaskCard } from "../../../../components/TaskCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CreateTaskModal } from "./components/CreateTaskModal";

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
      <div className="flex flex-col gap-8 p-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Typography className="text-gray-500">
            Simplifique sua rotina. Gerencie pendências com facilidade e foque no que realmente
            importa.
          </Typography>

          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <Typography className="min-w-[140px] text-center font-bold capitalize text-[#1A2E5A]">
              {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
            </Typography>

            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
            >
              <ChevronRight size={20} />
            </button>
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
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#3B82F6] rounded-2xl flex items-center justify-center text-white shadow-lg hover:brightness-110 transition-all z-40"
      >
        <span className="text-4xl font-light leading-none">+</span>
      </button>

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
