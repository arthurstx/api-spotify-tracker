
import z from 'zod'

export const syncTopStatsQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const syncTopStatsResponseSchema = z.object({
  count: z.number().describe('The number of items synced'),
})
