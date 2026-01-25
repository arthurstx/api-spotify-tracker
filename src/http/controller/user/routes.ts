import { FastifyInstance } from 'fastify'
import { getStats } from './get-stats'
import {
  getStatsQuerySchema,
  getStatsResponseSchema,
} from './schema/get-stats.schema'

export async function userRoutes(app: FastifyInstance) {
  app.get(
    '/user/get-stats',
    {
      schema: {
        querystring: getStatsQuerySchema,
        response: { 200: getStatsResponseSchema },
      },
    },
    getStats,
  )
}
