import z from 'zod'

export const listArtistQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const listArtistResponseSchema = z.object({
  artists: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable(),
    }),
  ),
})
