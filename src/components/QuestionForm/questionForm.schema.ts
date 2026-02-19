import { z } from "zod";

export const questionFormSchema = z.object({
  question: z
    .string()
    .min(5, "A pergunta deve ter pelo menos 5 caracteres")
    .max(500, "A pergunta deve ter no máximo 500 caracteres"),
  options: z
    .array(
      z.object({
        text: z
          .string()
          .min(1, "A alternativa não pode estar vazia")
          .max(200, "A alternativa deve ter no máximo 200 caracteres"),
        isCorrect: z.boolean(),
        position: z.number(),
      }),
    )
    .min(2, "A pergunta deve ter pelo menos 2 alternativas")
    .max(5, "A pergunta pode ter no máximo 5 alternativas")
    .refine((options) => options.filter((opt) => opt.isCorrect).length === 1, {
      message: "Deve haver exatamente 1 alternativa correta",
    }),
  timeLimit: z.number().min(10).max(300).optional(),
  explanation: z.string().max(1000).optional(),
  position: z.number(),
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;
