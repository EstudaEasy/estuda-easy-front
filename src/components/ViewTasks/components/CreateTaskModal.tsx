"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setHours, setMinutes } from "date-fns";
import { taskSchema, TaskFormData } from "../schemas/taskSchema";
import TaskService from "@/services/task/TaskService";

interface Props {
  selectedDate: Date;
  onSuccess: () => void;
  onClose: () => void;
}

export function CreateTaskModal({ selectedDate, onSuccess, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);

      const startDate = setMinutes(setHours(selectedDate, startH), startM).toISOString();
      const endDate = setMinutes(setHours(selectedDate, endH), endM).toISOString();

      await TaskService.create({
        name: data.name,
        description: data.description,
        startDate,
        endDate,
        status: "pending",
      });

      onSuccess();
      onClose();
    } catch (error) {
      alert("Erro ao criar tarefa. Verifique a sua conexão.");
      console.error("Erro ao criar tarefa:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-[#1A2E5A] mb-6">Criar Nova Tarefa</h2>

        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Título da Tarefa</label>
            <input
              {...register("name")}
              placeholder="Ex: Estudar Álgebra"
              className="w-full border border-gray-200 p-3 rounded-xl text-gray-900 focus:border-blue-500 outline-none bg-gray-50"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Descrição</label>
            <textarea
              {...register("description")}
              placeholder="Detalhes sobre a atividade..."
              className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px] text-gray-900 focus:border-blue-500 outline-none bg-gray-50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Início</label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full border border-gray-200 p-3 rounded-xl text-gray-900 bg-gray-50"
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Término</label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full border border-gray-200 p-3 rounded-xl text-gray-900 bg-gray-50"
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#3B82F6] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 disabled:bg-gray-300 transition-all"
          >
            {isSubmitting ? "A guardar..." : "Salvar Tarefa"}
          </button>
        </div>
      </form>
    </div>
  );
}
