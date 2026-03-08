"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizFormSchema, QuizFormData } from "./quizForm.schema";
import styles from "./quizForm.module.css";

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => Promise<void>;
  initialData?: QuizFormData;
  isLoading?: boolean;
}

export default function QuizForm({ onSubmit, initialData, isLoading = false }: QuizFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
    },
  });

  const description = watch("description") || "";

  return (
    <form id="quiz-form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Título<span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Ex: Quiz de Matemática"
          className={styles.input}
          disabled={isLoading}
          {...register("title")}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descrição <span style={{ color: "#64748b" }}>(opcional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Descreva sobre o que é este quiz..."
          className={styles.textarea}
          disabled={isLoading}
          {...register("description")}
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
        <div className={styles.charCount}>{description.length}/500 caracteres</div>
      </div>
    </form>
  );
}
