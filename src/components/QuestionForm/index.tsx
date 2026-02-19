"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/base";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { questionFormSchema, QuestionFormData } from "./questionForm.schema";
import styles from "./questionForm.module.css";

interface QuestionFormProps {
  quizId: string;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  initialData?: QuestionFormData;
  isLoading?: boolean;
}

export default function QuestionForm({
  quizId,
  onSubmit,
  initialData,
  isLoading = false,
}: QuestionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData || {
      question: "",
      options: [
        { text: "", isCorrect: true, position: 1 },
        { text: "", isCorrect: false, position: 2 },
      ],
      position: 1,
      timeLimit: undefined,
      explanation: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const watchAllFields = watch();

  const handleAddOption = () => {
    if (fields.length < 5) {
      append({
        text: "",
        isCorrect: false,
        position: fields.length + 1,
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <form id="question-form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Pergunta <span className={styles.required}>*</span>
        </label>
        <textarea
          {...register("question")}
          className={`${styles.textarea} ${errors.question ? styles.error : ""}`}
          placeholder="Digite a pergunta do quiz..."
          disabled={isLoading}
        />
        {errors.question && (
          <span className={styles.errorMessage}>{errors.question.message}</span>
        )}
      </div>

      <div className={styles.optionsSection}>
        <div className={styles.optionsSectionHeader}>
          <label className={styles.label}>
            Alternativas <span className={styles.required}>*</span>
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddOption}
            disabled={fields.length >= 5 || isLoading}
            className={styles.addButton}
          >
            <LuPlus size={16} />
            Adicionar Alternativa
          </Button>
        </div>

        <div className={styles.optionsList}>
          {fields.map((field, index) => {
            const isCorrect = watchAllFields.options?.[index]?.isCorrect === true;
            
            return (
              <div
                key={field.id}
                className={`${styles.optionItem} ${isCorrect ? styles.correct : ""}`}
              >
                <div className={styles.radioWrapper}>
                  <input
                    type="radio"
                    name="correctOption"
                    value={index}
                    checked={isCorrect}
                    onChange={() => {
                      watchAllFields.options?.forEach((_, i) => {
                        setValue(`options.${i}.isCorrect`, i === index);
                      });
                    }}
                    className={styles.radioInput}
                    disabled={isLoading}
                  />
                  <input
                    type="hidden"
                    {...register(`options.${index}.isCorrect`)}
                    value={isCorrect ? "true" : "false"}
                  />
                  <input type="hidden" {...register(`options.${index}.position`)} value={index + 1} />
                </div>

                <div className={styles.optionContent}>
                  <span className={styles.optionNumber}>Alternativa {index + 1}</span>
                  <input
                    {...register(`options.${index}.text`)}
                    type="text"
                    className={`${styles.input} ${errors.options?.[index]?.text ? styles.error : ""}`}
                    placeholder={`Digite a alternativa ${index + 1}...`}
                    disabled={isLoading}
                  />
                  {errors.options?.[index]?.text && (
                    <span className={styles.errorMessage}>
                      {errors.options[index]?.text?.message}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  disabled={fields.length <= 2 || isLoading}
                  className={styles.deleteButton}
                  title="Remover alternativa"
                >
                  <LuTrash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {errors.options?.root && (
          <span className={styles.errorMessage}>{errors.options.root.message}</span>
        )}
        {errors.options?.message && (
          <span className={styles.errorMessage}>{errors.options.message}</span>
        )}

        <p className={styles.helpText}>
          Selecione o círculo ao lado da alternativa correta. Mínimo 2, máximo 5 alternativas.
        </p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Tempo Limite (segundos)</label>
        <input
          {...register("timeLimit", { valueAsNumber: true })}
          type="number"
          min="10"
          max="300"
          className={`${styles.input} ${errors.timeLimit ? styles.error : ""}`}
          placeholder="Ex: 30 (opcional)"
          disabled={isLoading}
        />
        {errors.timeLimit && (
          <span className={styles.errorMessage}>{errors.timeLimit.message}</span>
        )}
        <p className={styles.helpText}>Entre 10 e 300 segundos (deixe em branco para ilimitado)</p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Explicação da Resposta</label>
        <textarea
          {...register("explanation")}
          className={`${styles.textarea} ${errors.explanation ? styles.error : ""}`}
          placeholder="Explique por que esta é a resposta correta (opcional)..."
          disabled={isLoading}
          style={{ minHeight: "80px" }}
        />
        {errors.explanation && (
          <span className={styles.errorMessage}>{errors.explanation.message}</span>
        )}
      </div>
    </form>
  );
}
