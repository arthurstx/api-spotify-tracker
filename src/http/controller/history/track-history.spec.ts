import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe('Track History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get track history', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { spotify_id: spotifyId } = authResponse.body

    const track = await prisma.track.findFirstOrThrow()

    const response = await request(app.server)
      .get(`/history/track/${track.id}`)
      .set('Authorization', `Bearer ${spotifyId}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        track: expect.objectContaining({
          name: expect.any(String),
          imageUrl: expect.any(String),
        }),
        history: expect.any(Array),
      }),
    )
  })
})
