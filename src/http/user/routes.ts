import { FastifyInstance } from 'fastify'
import { getStats } from './get-stats'

export async function userRoutes(app: FastifyInstance) {
  app.get('/user/get-stats', getStats)
}
