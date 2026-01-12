import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe('Artist History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get artist history', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { spotify_id: spotifyId } = authResponse.body

    const artist = await prisma.artist.findFirstOrThrow()

    const response = await request(app.server)
      .get(`/history/artist/${artist.id}`)
      .set('Authorization', `Bearer ${spotifyId}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        artist: expect.objectContaining({
          name: expect.any(String),
          genres: expect.any(Array),
          imageUrl: expect.any(String),
        }),
        history: expect.any(Array),
      }),
    )
  })
})
