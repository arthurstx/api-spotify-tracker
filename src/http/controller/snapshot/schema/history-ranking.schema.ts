
import z from 'zod'

export const historyRankingQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const historyRankingResponseSchema = z.object({
  count: z.number().describe('The number of items ranked'),
})
