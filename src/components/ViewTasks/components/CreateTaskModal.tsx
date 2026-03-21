"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "../schemas/taskSchema";
import TaskService from "@/services/task/TaskService";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  selectedDate: Date;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({ open, selectedDate, onSuccess, onOpenChange }: Props) {
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

      const startDateObj = new Date(selectedDate);
      startDateObj.setHours(startH, startM, 0, 0);

      const endDateObj = new Date(selectedDate);
      endDateObj.setHours(endH, endM, 0, 0);

      await TaskService.create({
        name: data.name,
        description: data.description,
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
        status: "pending",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error(getErrorMessage(error, "Erro ao criar tarefa."));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="w-full border border-gray-200 p-3 rounded-xl min-h-25 text-gray-900 focus:border-blue-500 outline-none bg-gray-50 resize-none"
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
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="create-task-form" disabled={isSubmitting}>
            {isSubmitting ? "A guardar..." : "Salvar Tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
