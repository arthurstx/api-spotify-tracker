import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const authResponse = await request(app.server).get('/auth/login').query({
    code: 'valid-code',
    state: 'valid-state',
  })

  return { authResponse }
}
