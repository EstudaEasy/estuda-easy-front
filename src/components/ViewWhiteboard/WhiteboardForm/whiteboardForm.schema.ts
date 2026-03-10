import { z } from "zod";
import { quizFormSchema } from "../../QuizForm/quizForm.schema";

export const whiteboardFormSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter no mínimo 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
});

export type WhiteboardFormData = z.infer<typeof whiteboardFormSchema>;
