import z from 'zod'

export const listAvailableQuerySchema = z.object({
  id: z.uuid(),
})

export const listAvailableResponseSchema = z.object({
  snapshotDate: z.array(z.string()),
})
