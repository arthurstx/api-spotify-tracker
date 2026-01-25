import { FastifyInstance } from 'fastify'
import { listTrack } from './list-track'
import { listArtist } from './list-artist'
import { listArtistQuerySchema } from './schema/list-artist.schema'
import { listTrackQuerySchema } from './schema/list-track.schema'

export async function catalogRoutes(app: FastifyInstance) {
  app.get(
    '/catalog/tracks',
    {
      schema: {
        querystring: listTrackQuerySchema,
        response: { 200: listTrackQuerySchema },
      },
    },
    listTrack,
  )
  app.get(
    '/catalog/artists',
    {
      schema: {
        querystring: listArtistQuerySchema,
        response: { 200: listArtistQuerySchema },
      },
    },
    listArtist,
  )
}
