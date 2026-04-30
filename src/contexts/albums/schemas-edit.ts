import { z } from 'zod';

export const albumEditFormSchema = z.object({
  title: z.string().min(1, { message: "Campo obrigatório!" }).max(255),
  photosIds: z.array(z.string().optional()),
})

export type AlbumEditFormSchema = z.infer<typeof albumEditFormSchema>
