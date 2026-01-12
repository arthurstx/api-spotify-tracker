import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Top History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get top history', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { spotify_id: spotifyId } = authResponse.body

    const response = await request(app.server)
      .get(`/history/top`)
      .set('Authorization', `Bearer ${spotifyId}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        artists: expect.any(Array),
        tracks: expect.any(Array),
      }),
    )
  })
})
