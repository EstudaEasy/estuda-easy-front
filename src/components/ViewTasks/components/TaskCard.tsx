"use client";

import { useState } from "react";
import { TaskResponse } from "../../../types/task";
import { format, parseISO } from "date-fns";
import { UpdateTaskModal } from "./UpdateTaskModal";
import TaskService from "@/services/task/TaskService";
import { activityStorage } from "@/lib/activityStorage";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessage";

export function TaskCard({ task, onRefresh }: { task: TaskResponse; onRefresh: () => void }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const startTime = task.startDate ? format(parseISO(task.startDate), "HH:mm") : "00:00";
  const endTime = task.endDate ? format(parseISO(task.endDate), "HH:mm") : "00:00";

  const isCompleted = task.status === "completed";

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUpdating) return;

    try {
      setIsUpdating(true);

      const newStatus = isCompleted ? "pending" : "completed";

      await TaskService.update(task.id, {
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        status: newStatus,
      });

      onRefresh();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(getErrorMessage(error, "Não foi possível atualizar o status da tarefa."));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardClick = () => {
    activityStorage.addActivity({
      title: task.name,
      tool: "Tarefas",
      icon: "LuBook",
      iconClass: "bg-blue-100 text-blue-600",
      resourceId: task.id,
      resourceType: "task",
    });
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`p-6 rounded-2xl flex items-center justify-between min-h-[120px] shadow-sm transition-all hover:scale-[1.02] cursor-pointer relative ${
          isCompleted ? "bg-emerald-500 opacity-80" : "bg-blue-500"
        } text-white`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={`w-6 h-6 border-2 rounded-full flex-shrink-0 transition-all flex items-center justify-center ${
              isCompleted ? "bg-white border-white" : "border-white/50 hover:bg-white/20"
            }`}
          >
            {isCompleted && (
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          <div className={isCompleted ? "line-through opacity-70" : ""}>
            <h3 className="font-bold text-lg leading-tight">{task.name}</h3>
            <p className="text-xs opacity-80 line-clamp-2">{task.description}</p>
          </div>
        </div>

        <span className="text-xs font-semibold whitespace-nowrap bg-white/20 px-3 py-1 rounded-full border border-white/10">
          {startTime} - {endTime}
        </span>
      </div>

      <UpdateTaskModal
        open={isEditModalOpen}
        task={task}
        onSuccess={onRefresh}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}
