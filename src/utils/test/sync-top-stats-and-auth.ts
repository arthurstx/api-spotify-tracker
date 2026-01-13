import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function syncTopStatsAndAuth(app: FastifyInstance) {
  const authResponse = await request(app.server).get('/auth/login').query({
    code: 'valid-code',
    state: 'valid-state',
  })

  const { id } = authResponse.body

  await request(app.server).post(`/snapshot/sync-top-stats?id=${id}`).send()

  return { authResponse }
}
