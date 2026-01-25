import z from 'zod'
import { TimeRange } from '../../../../../generated/prisma/enums'

export const getLatestArtistsQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const getLatestArtistsBodySchema = z.object({
  timeRange: z.enum(TimeRange).describe('The time range to filter the artists'),
})

export const getLatestArtistsResponseSchema = z.object({
  artists: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable().optional(),
      position: z.number(),
    }),
  ),
  snapshotDate: z.date(),
})
