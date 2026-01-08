import { FastifyInstance } from 'fastify'
import { getLatestArtists } from './get-latest-artist'

export async function rankingsRoutes(app: FastifyInstance) {
  app.post('/rankings/get-latest-artists', getLatestArtists)
}
