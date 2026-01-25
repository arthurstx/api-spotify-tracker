
import z from 'zod'
import { TimeRange } from '../../../../../generated/prisma/enums'

export const artistHistoryQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const artistHistoryBodySchema = z.object({
  artistId: z.string().describe('The unique identifier of the artist'),
  timeRange: z.nativeEnum(TimeRange).optional().describe('The time range to filter the history'),
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
