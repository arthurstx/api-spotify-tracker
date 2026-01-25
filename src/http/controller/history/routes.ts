import { FastifyInstance } from 'fastify'
import { trackHistory } from './track-history'
import { artistHistory } from './artist-history'
import { topHistory } from './top-history'
import {
  trackHistoryBodySchema,
  trackHistoryQuerySchema,
  trackHistoryResponseSchema,
} from './schema/track-history.schema'
import {
  artistHistoryBodySchema,
  artistHistoryQuerySchema,
  artistHistoryResponseSchema,
} from './schema/artist-history.schema'
import {
  topHistoryBodySchema,
  topHistoryQuerySchema,
  topHistoryResponseSchema,
} from './schema/top-history.schema'

export async function historyRoutes(app: FastifyInstance) {
  app.post(
    '/history/track-history',
    {
      schema: {
        querystring: trackHistoryQuerySchema,
        body: trackHistoryBodySchema,
        response: {
          200: trackHistoryResponseSchema,
        },
      },
    },
    trackHistory,
  )
  app.post(
    '/history/artist-history',
    {
      schema: {
        querystring: artistHistoryQuerySchema,
        body: artistHistoryBodySchema,
        response: {
          200: artistHistoryResponseSchema,
        },
      },
    },
    artistHistory,
  )
  app.post(
    '/history/top-history',
    {
      schema: {
        querystring: topHistoryQuerySchema,
        body: topHistoryBodySchema,
        response: {
          200: topHistoryResponseSchema,
        },
      },
    },
    topHistory,
  )
}