import z from 'zod'

export const getStatsQuerySchema = z.object({
  id: z.uuid(),
})

export const getStatsResponseSchema = z.object({
  totalSnapshots: z.number().int().nonnegative(),
  totalTrackedArtists: z.number().int().nonnegative(),
  totalTrackedTracks: z.number().int().nonnegative(),
  firstSnapshotDate: z.string().nullable(),
  lastSnapshotDate: z.string().nullable(),
})
