import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'

export async function authRoutes(app: FastifyInstance) {
  app.get('/auth/login', authenticate)
}
