"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WhiteboardFormData, whiteboardFormSchema } from "./whiteboardForm.schema";

interface WhiteboardFormProps {
  onSubmit: (data: WhiteboardFormData) => Promise<void>;
  initialData?: WhiteboardFormData;
  isLoading?: boolean;
}

export default function WhiteboardForm({
  onSubmit,
  initialData,
  isLoading = false,
}: WhiteboardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhiteboardFormData>({
    resolver: zodResolver(whiteboardFormSchema),
    defaultValues: initialData || {
      title: "",
    },
  });

  return (
    <form id="whiteboard-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Ex: Anotações para prova de História"
          className="w-full border border-gray-200 p-3 rounded-xl text-gray-900 focus:border-blue-500 outline-none bg-gray-50"
          disabled={isLoading}
          {...register("title")}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>}
      </div>
    </form>
  );
}
