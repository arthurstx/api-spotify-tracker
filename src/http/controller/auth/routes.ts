import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refreshToken } from './refresh-token'
import {
  authenticateQuerySchema,
  authenticateResponseSchema,
} from './schemas/authenticate.schema'
import {
  refreshTokenQuerySchema,
  refreshTokenResponseSchema,
} from './schemas/refresh-token.schema'

export async function authRoutes(app: FastifyInstance) {
  app.get(
    '/auth/login',
    {
      schema: {
        querystring: authenticateQuerySchema,
        response: {
          200: authenticateResponseSchema,
        },
      },
    },
    authenticate,
  )
  app.post(
    '/auth/refresh-token',
    {
      schema: {
        querystring: refreshTokenQuerySchema,
        response: {
          201: refreshTokenResponseSchema,
        },
      },
    },
    refreshToken,
  )
}
