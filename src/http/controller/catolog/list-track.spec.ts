import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('List Tracks (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list tracks', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { spotify_id: spotifyId } = authResponse.body

    const response = await request(app.server)
      .get(`/catolog/tracks`)
      .set('Authorization', `Bearer ${spotifyId}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.tracks).toHaveLength(10)
  })
})
