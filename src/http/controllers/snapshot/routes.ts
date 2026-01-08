import { FastifyInstance } from 'fastify'
import { syncTopStats } from './sync-top-stats'

export async function snapshotRoutes(app: FastifyInstance) {
  app.post('/snapshot/sync-top-stats', syncTopStats)
}
