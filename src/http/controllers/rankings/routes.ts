import { FastifyInstance } from 'fastify'
import { getLatestArtists } from './get-latest-artist'
import { getLatestTrack } from './get-lastest-tracks'

export async function rankingsRoutes(app: FastifyInstance) {
  app.post('/rankings/get-latest-artists', getLatestArtists)
  app.post('/rankings/get-latest-tracks', getLatestTrack)
}
