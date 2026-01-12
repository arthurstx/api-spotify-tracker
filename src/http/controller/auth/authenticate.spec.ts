import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should authenticate user and persist it', async () => {
    const response = await request(app.server)
      .get('/auth/login')
      .query({
        code: 'valid-code',
        state: 'valid-state',
      })
      .expect(201)

    expect(response.body).toMatchObject({
      spotifyId: 'spotify_id',
      email: 'jhondoe@example.com',
    })
  })
})
