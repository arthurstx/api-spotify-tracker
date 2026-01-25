import z from 'zod'

export const getLatestTracksQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const getLatestTracksBodySchema = z.object({})

export const getLatestTracksResponseSchema = z.object({
  tracks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable().optional(),
      position: z.number(),
    }),
  ),
  snapshotDate: z.date(),
})
