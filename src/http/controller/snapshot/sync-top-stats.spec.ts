import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Sync Top Stats (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to sync top stats', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { id } = authResponse.body

    try {
      await request(app.server).post(`/snapshot/sync-top-stats?id=${id}`).send()
    } catch (error) {
      console.log(error)
    }
    const response = await request(app.server)
      .post(`/snapshot/sync-top-stats?id=${id}`)
      .send()

    expect(response.statusCode).toEqual(201)
  })
})
