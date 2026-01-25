import z from 'zod'

export const getDailyQuerySchema = z.object({
  id: z.uuid(),
})

export const getDailyResponseSchema = z.object({
  hasSnapshotToday: z.boolean(),
  snapshotDate: z.date().nullable(),
})
