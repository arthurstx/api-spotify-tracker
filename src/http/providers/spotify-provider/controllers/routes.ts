import { FastifyInstance } from 'fastify'
import { userAuthorization } from './user-authorization'

export async function spotifyProviderRoutes(app: FastifyInstance) {
  app.get('/auth/code', userAuthorization)
}
