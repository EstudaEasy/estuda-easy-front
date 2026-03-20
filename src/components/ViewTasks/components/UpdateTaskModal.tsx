"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setHours, setMinutes, format, parseISO } from "date-fns";
import { taskSchema, TaskFormData } from "../schemas/taskSchema";
import TaskService from "@/services/task/TaskService";
import { TaskResponse } from "../../../types/task";
import { toast } from "sonner";
import { activityStorage } from "@/lib/activityStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  task: TaskResponse;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function UpdateTaskModal({ open, task, onSuccess, onOpenChange }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

      toast.success("Tarefa atualizada com sucesso!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast.error("Não foi possível atualizar a tarefa.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await TaskService.delete(task.id);
      activityStorage.removeActivity(task.id);
      setIsDeleteDialogOpen(false);
      toast.success("Tarefa excluída com sucesso!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao excluir tarefa.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} id="update-task-form" className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Título</label>
              <input
                {...register("name")}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Descrição</label>
              <textarea
                {...register("description")}
                className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px] bg-gray-50 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Início</label>
                <input
                  type="time"
                  {...register("startTime")}
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Término</label>
                <input
                  type="time"
                  {...register("endTime")}
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </form>

          <DialogFooter className="flex justify-between gap-2">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isSubmitting || isDeleting}
            >
              Excluir
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isDeleting}
              >
                Cancelar
              </Button>
              <Button type="submit" form="update-task-form" disabled={isSubmitting || isDeleting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
