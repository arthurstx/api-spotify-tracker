
import z from 'zod'
import { TimeRange } from '../../../../../generated/prisma/enums'

export const trackHistoryQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const trackHistoryBodySchema = z.object({
  trackId: z.string().describe('The unique identifier of the track'),
  timeRange: z.nativeEnum(TimeRange).optional().describe('The time range to filter the history'),
})

export const trackHistoryResponseSchema = z.object({
  track: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable().optional(),
    artistsName: z.array(z.string()),
  }),
  history: z.array(
    z.object({
      snapshotId: z.string(),
      position: z.number(),
      playedAt: z.date(),
    }),
  ),
})
