import { z } from "zod";

export const flashcardFormSchema = z.object({
  front: z
    .string()
    .min(1, "Frente deve ter no mínimo 1 caractere")
    .max(100, "Frente deve ter no máximo 100 caracteres"),
  back: z
    .string()
    .min(1, "Verso deve ter no mínimo 1 caractere")
    .max(100, "Verso deve ter no máximo 100 caracteres"),
});

export type FlashcardFormData = z.infer<typeof flashcardFormSchema>;
