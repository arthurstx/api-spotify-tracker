import z from 'zod'

export const getItemsQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const getItemsBodySchema = z.object({
  entity: z
    .enum(['artists', 'tracks'])
    .describe('The entity type, can be artists or tracks'),
})

export const getItemsResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().nullable().optional(),
      position: z.number(),
    }),
  ),
})
