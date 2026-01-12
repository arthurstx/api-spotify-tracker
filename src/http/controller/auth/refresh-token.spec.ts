import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)

    const { id } = authResponse.body

    const response = await request(app.server)
      .post(`/auth/refresh-token?id=${id}`)
      .send()

    expect(response.body.accessToken).toBe('new-access-token')
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    )
  })
})
