"use client";

import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import TaskService from "@/services/task/TaskService";
import { useState } from "react";
import { toast } from "sonner";
import { TaskResponse } from "@/types/task";
import { getErrorMessage } from "@/lib/errorMessage";

export function DailyTasksWidget() {
  const { tasks, loading, refreshTasks } = useTasks();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const toggleTask = async (task: TaskResponse) => {
    if (!task.id || updatingTaskId) return;
    try {
      setUpdatingTaskId(task.id);
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await TaskService.update(task.id, { status: newStatus });
      await refreshTasks();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Erro ao atualizar tarefa."));
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <Card className="w-full h-full xl:min-w-[400px] border-gray-200">
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="text-xl text-[#1A2E5A] flex justify-between items-center">
          Tarefas de Hoje
          <span className="text-sm font-normal text-gray-500 capitalize">
            {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
            <span>Progresso Geral</span>
            <span className="font-semibold">
              {completed} / {total}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100" />
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            Nenhuma tarefa marcada para hoje!
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors"
              >
                <button
                  onClick={() => toggleTask(task)}
                  disabled={Boolean(updatingTaskId)}
                  className="shrink-0 mt-0.5 outline-none focus-visible:ring-2 rounded-full"
                  aria-label={
                    task.status === "completed"
                      ? "Marcar tarefa como pendente"
                      : "Marcar tarefa como concluída"
                  }
                >
                  {updatingTaskId === task.id ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : task.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 hover:text-emerald-600 transition-colors" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 hover:text-blue-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {task.name}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
