import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Get Latest Artist (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get latest artists', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { spotify_id: spotifyId } = authResponse.body

    const response = await request(app.server)
      .get(`/rankings/artists`)
      .set('Authorization', `Bearer ${spotifyId}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        artists: expect.any(Array),
      }),
    )
  })
})
