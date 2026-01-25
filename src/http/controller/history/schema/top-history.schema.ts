import z from 'zod'

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
