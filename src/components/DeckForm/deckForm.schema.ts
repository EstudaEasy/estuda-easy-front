import { z } from "zod";

export const deckFormSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(100, "Descrição deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
});

export type DeckFormData = z.infer<typeof deckFormSchema>;
