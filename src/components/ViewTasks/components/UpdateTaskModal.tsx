"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setHours, setMinutes, format, parseISO } from "date-fns";
import { taskSchema, TaskFormData } from "../schemas/taskSchema";
import TaskService from "@/services/task/TaskService";
import { TaskResponse } from "../../../types/task";

interface Props {
  task: TaskResponse;
  onSuccess: () => void;
  onClose: () => void;
}

export function UpdateTaskModal({ task, onSuccess, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      description: task.description || "",
      startTime: task.startDate ? format(parseISO(task.startDate), "HH:mm") : "09:00",
      endTime: task.endDate ? format(parseISO(task.endDate), "HH:mm") : "10:00",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (!task.startDate) {
        throw new Error("Data de início não encontrada.");
      }

      const baseDate = parseISO(task.startDate);
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);

      const startDate = setMinutes(setHours(baseDate, startH), startM).toISOString();
      const endDate = setMinutes(setHours(baseDate, endH), endM).toISOString();

      await TaskService.update(task.id, {
        name: data.name,
        description: data.description,
        startDate,
        endDate,
        status: task.status,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Não foi possível atualizar a tarefa.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await TaskService.delete(task.id);
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir tarefa.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1A2E5A]">Editar Tarefa</h2>
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-bold"
          >
            Excluir
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Título</label>
            <input
              {...register("name")}
              className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Descrição</label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px] bg-gray-50 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Início</label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Término</label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
