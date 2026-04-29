import { z } from 'zod';

export const photoEditFormSchema = z.object({
  title: z.string().min(1, { message: "Campo obrigatório!" }).max(255),
})

export type PhotoEditFormSchema = z.infer<typeof photoEditFormSchema>
