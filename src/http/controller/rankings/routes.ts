import { FastifyInstance } from 'fastify'
import { getLatestArtists } from './get-latest-artist'
import { getLatestTrack } from './get-lastest-tracks'
import { getItems } from './get-items'
import {
  getItemsBodySchema,
  getItemsQuerySchema,
  getItemsResponseSchema,
} from './schema/get-items.schema'
import {
  getLatestArtistsBodySchema,
  getLatestArtistsQuerySchema,
  getLatestArtistsResponseSchema,
} from './schema/get-latest-artists.schema'
import {
  getLatestTracksBodySchema,
  getLatestTracksQuerySchema,
  getLatestTracksResponseSchema,
} from './schema/get-latest-tracks.schema'

export async function rankingsRoutes(app: FastifyInstance) {
  app.post(
    '/rankings/get-items',
    {
      schema: {
        querystring: getItemsQuerySchema,
        body: getItemsBodySchema,
        response: {
          200: getItemsResponseSchema,
        },
      },
    },
    getItems,
  )
  app.post(
    '/rankings/get-latest-artists',
    {
      schema: {
        querystring: getLatestArtistsQuerySchema,
        body: getLatestArtistsBodySchema,
        response: {
          200: getLatestArtistsResponseSchema,
        },
      },
    },
    getLatestArtists,
  )
  app.post(
    '/rankings/get-latest-tracks',
    {
      schema: {
        querystring: getLatestTracksQuerySchema,
        body: getLatestTracksBodySchema,
        response: {
          200: getLatestTracksResponseSchema,
        },
      },
    },
    getLatestTrack,
  )
}
