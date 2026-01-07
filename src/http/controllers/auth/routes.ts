import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refreshToken } from './refresh-token'

export async function authRoutes(app: FastifyInstance) {
  app.get('/auth/login', authenticate)
  app.post('/auth/refresh-token', refreshToken)
}
