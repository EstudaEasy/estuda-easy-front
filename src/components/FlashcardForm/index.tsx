"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flashcardFormSchema, FlashcardFormData } from "./flashcardForm.schema";
import styles from "./flashcardForm.module.css";

interface FlashcardFormProps {
  onSubmit: (data: FlashcardFormData) => Promise<void>;
  initialData?: FlashcardFormData;
  isLoading?: boolean;
}

export default function FlashcardForm({
  onSubmit,
  initialData,
  isLoading = false,
}: FlashcardFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FlashcardFormData>({
    resolver: zodResolver(flashcardFormSchema),
    defaultValues: initialData || {
      front: "",
      back: "",
    },
  });

  const front = watch("front") || "";
  const back = watch("back") || "";

  return (
    <form id="flashcard-form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="front" className={styles.label}>
          Frente (Pergunta)<span className={styles.required}>*</span>
        </label>
        <textarea
          id="front"
          placeholder="Ex: Qual é a capital da França?"
          className={styles.textarea}
          disabled={isLoading}
          {...register("front")}
        />
        {errors.front && <span className={styles.error}>{errors.front.message}</span>}
        <div className={styles.charCount}>{front.length}/100 caracteres</div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="back" className={styles.label}>
          Verso (Resposta)<span className={styles.required}>*</span>
        </label>
        <textarea
          id="back"
          placeholder="Ex: Paris"
          className={styles.textarea}
          disabled={isLoading}
          {...register("back")}
        />
        {errors.back && <span className={styles.error}>{errors.back.message}</span>}
        <div className={styles.charCount}>{back.length}/100 caracteres</div>
      </div>
    </form>
  );
}
