import { FastifyInstance } from 'fastify'
import { syncTopStats } from './sync-top-stats'
import { getDaily } from './get-daily'
import { syncStatus } from './check-daily-sync'
import { listAvailable } from './list-aivailable'
import { historyRanking } from './history-ranking'
import {
  syncTopStatsQuerySchema,
  syncTopStatsResponseSchema,
} from './schema/sync-top-stats.schema'
import {
  historyRankingQuerySchema,
  historyRankingResponseSchema,
} from './schema/history-ranking.schema'
import {
  getDailyBodySchema,
  getDailyQuerySchema,
  getDailyResponseSchema,
} from './schema/get-daily.schema'
import {
  listAvailableQuerySchema,
  listAvailableResponseSchema,
} from './schema/list-available.schema'

export async function snapshotRoutes(app: FastifyInstance) {
  app.post(
    '/snapshot/sync-top-stats',
    {
      schema: {
        querystring: syncTopStatsQuerySchema,
        response: { 200: syncTopStatsResponseSchema },
      },
    },
    syncTopStats,
  )

  app.post(
    '/snapshot/history-ranking',
    {
      schema: {
        querystring: historyRankingQuerySchema,
        response: { 201: historyRankingResponseSchema },
      },
    },
    historyRanking,
  )

  app.post(
    '/snapshot/get-daily',
    {
      schema: {
        querystring: getDailyQuerySchema,
        body: getDailyBodySchema,
        response: { 200: getDailyResponseSchema },
      },
    },
    getDaily,
  )
  app.get(
    '/snapshot/sync-status',
    {
      schema: {
        querystring: syncTopStatsQuerySchema,
        response: { 200: syncTopStatsResponseSchema },
      },
    },
    syncStatus,
  )

  app.get(
    '/snapshot/list-available',
    {
      schema: {
        querystring: listAvailableQuerySchema,
        response: { 200: listAvailableResponseSchema },
      },
    },
    listAvailable,
  )
}
