"use client";

import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, addDays, subDays, isSameDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DiaryCard } from "./components/DiaryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DiaryResponse } from "@/types/diary";
import EmptyToolState from "@/components/EmptyToolState/EmptyToolState";

interface ViewDiaryProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  diaries: DiaryResponse[];
  refreshDiaries: () => void;
  onCreateDiary: () => void;
}

export default function ViewDiary({
  selectedDate,
  setSelectedDate,
  diaries,
  refreshDiaries,
  onCreateDiary,
}: ViewDiaryProps) {
  const days = Array.from({ length: 17 }, (_, i) => addDays(subDays(selectedDate, 8), i));

  const selectedDateDiaries = diaries.filter((diary) => {
    const diaryDate = new Date(diary.createdAt);
    return isSameDay(diaryDate, selectedDate);
  });

  const handleNextMonth = () => {
    const nextMonthDate = startOfMonth(addMonths(selectedDate, 1));
    setSelectedDate(nextMonthDate);
  };

  const handlePrevMonth = () => {
    const prevMonthDate = startOfMonth(subMonths(selectedDate, 1));
    setSelectedDate(prevMonthDate);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row md:items-center justify-center gap-4">
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
              const dayHasDiaries = diaries.some((diary) =>
                isSameDay(new Date(diary.createdAt), day),
              );

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
                        ? "bg-purple-500 text-white scale-110 shadow-md"
                        : dayHasDiaries
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {format(day, "d")}
                  </div>

                  <div
                    className={`w-1 h-1 rounded-full ${isSelected ? "bg-purple-500" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {selectedDateDiaries.length === 0 ? (
          <EmptyToolState
            title="Nada por aqui... (ainda!)"
            description="Adicione um pensamento e comece a descrever seu dia."
            actionLabel="Adicionar pensamento"
            onAction={onCreateDiary}
          />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDateDiaries
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((diary) => (
                  <DiaryCard key={diary.id} diary={diary} onRefresh={refreshDiaries} />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
