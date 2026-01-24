import { FastifyInstance } from 'fastify'
import { getLatestArtists } from './get-latest-artist'
import { getLatestTrack } from './get-lastest-tracks'
import { getItems } from './get-items'

export async function rankingsRoutes(app: FastifyInstance) {
  app.get('/rankings/get-items', getItems)
  app.post('/rankings/get-latest-artists', getLatestArtists)
  app.post('/rankings/get-latest-tracks', getLatestTrack)
}
