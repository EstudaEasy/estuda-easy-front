import { z } from "zod";

export const diarySchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().optional(),
});

export type DiaryFormData = z.infer<typeof diarySchema>;
