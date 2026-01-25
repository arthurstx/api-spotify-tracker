import z from 'zod'
import { TimeRange } from '../../../../../generated/prisma/enums'

export enum EntityType {
  ARTIST = 'ARTIST',
  TRACK = 'TRACK',
}

export const topHistoryQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const topHistoryBodySchema = z.object({
  entityType: z
    .enum(EntityType)
    .describe('The entity type, can be ARTIST or TRACK'),
  entityId: z.string().describe('The unique identifier of the entity'),
  timeRange: z
    .enum(TimeRange)
    .optional()
    .describe('The time range to filter the history'),
  periodInDays: z.number().describe('The period in days to filter the history'),
})

export const topHistoryResponseSchema = z.object({
  history: z.array(
    z.object({
      snapshotId: z.string(),
      position: z.number(),
      playedAt: z.date(),
    }),
  ),
})
