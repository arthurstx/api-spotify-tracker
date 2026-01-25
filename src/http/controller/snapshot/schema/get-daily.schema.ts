import z from 'zod'

export const getDailyQuerySchema = z.object({
  id: z.uuid(),
})

export const getDailyBodySchema = z.object({
  setSnapshotDate: z.coerce.date(),
})

export const getDailyResponseSchema = z.object({
  artists: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable().optional(),
      position: z.number(),
    }),
  ),
  tracks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable().optional(),
      position: z.number(),
      artistName: z.array(z.string()),
    }),
  ),
  snapshotDate: z.date(),
})
