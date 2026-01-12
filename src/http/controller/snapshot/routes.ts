import { FastifyInstance } from 'fastify'
import { syncTopStats } from './sync-top-stats'
import { getDaily } from './get-daily'
import { syncStatus } from './check-daily-sync'
import { listAvailable } from './list-aivailable'

export async function snapshotRoutes(app: FastifyInstance) {
  app.post('/snapshot/sync-top-stats', syncTopStats)
  app.post('/snapshot/get-daily', getDaily)
  app.get('/snapshot/sync-status', syncStatus)
  app.get('/snapshot/list-available', listAvailable)
}
