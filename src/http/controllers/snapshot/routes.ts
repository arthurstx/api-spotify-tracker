import { FastifyInstance } from 'fastify'
import { syncTopStats } from './sync-top-stats'
import { getDaily } from './get-daily'

export async function snapshotRoutes(app: FastifyInstance) {
  app.post('/snapshot/sync-top-stats', syncTopStats)
  app.post('/snapshot/get-daily', getDaily)
}
