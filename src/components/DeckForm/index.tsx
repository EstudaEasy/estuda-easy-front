"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deckFormSchema, DeckFormData } from "./deckForm.schema";
import styles from "./deckForm.module.css";

interface DeckFormProps {
  onSubmit: (data: DeckFormData) => Promise<void>;
  initialData?: DeckFormData;
  isLoading?: boolean;
}

export default function DeckForm({ onSubmit, initialData, isLoading = false }: DeckFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeckFormData>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const description = watch("description") || "";

  return (
    <form id="deck-form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Nome<span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Flashcards de Inglês"
          className={styles.input}
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descrição <span style={{ color: "#64748b" }}>(opcional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Descreva sobre o que é este deck de flashcards..."
          className={styles.textarea}
          disabled={isLoading}
          {...register("description")}
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
        <div className={styles.charCount}>{description.length}/100 caracteres</div>
      </div>
    </form>
  );
}
