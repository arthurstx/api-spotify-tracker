import { FastifyInstance } from 'fastify'
import { trackHistory } from './track-history'
import { artistHistory } from './artist-history'

export async function historyRoutes(app: FastifyInstance) {
  app.post('/history/track-history', trackHistory)
  app.post('/history/artist-history', artistHistory)
}
