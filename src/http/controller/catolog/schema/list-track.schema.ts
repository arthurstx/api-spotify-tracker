import z from 'zod'

export const listTrackQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const listTrackResponseSchema = z.object({
  tracks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable().optional(),
      artistsName: z.array(z.string()),
    }),
  ),
})
