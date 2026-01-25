import z from 'zod'

export const artistHistoryQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const artistHistoryBodySchema = z.object({
  artistId: z.string().describe('The unique identifier of the artist'),
})

export const artistHistoryResponseSchema = z.object({
  artist: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable().optional(),
  }),
  history: z.array(
    z.object({
      snapshotId: z.string(),
      position: z.number(),
      playedAt: z.date(),
    }),
  ),
})
