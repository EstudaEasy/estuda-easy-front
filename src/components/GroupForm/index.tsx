"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema, GroupFormData } from "./groupForm.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GroupFormProps {
  onSubmit: (data: GroupFormData) => Promise<void>;
  initialData?: GroupFormData;
  isLoading?: boolean;
}

export default function GroupForm({ onSubmit, initialData, isLoading = false }: GroupFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const description = watch("description") || "";

  return (
    <form id="group-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="flex items-center">
          Nome do Grupo
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Matemática Avançada"
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="flex items-center">
          Descrição
          <span className="text-gray-500 text-xs ml-1">(opcional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva sobre este grupo de estudo..."
          disabled={isLoading}
          {...register("description")}
          className="min-h-24"
        />
        {errors.description && (
          <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>
        )}
        <div className="text-xs text-gray-500 text-right mt-1">
          {description.length}/500 caracteres
        </div>
      </div>
    </form>
  );
}
