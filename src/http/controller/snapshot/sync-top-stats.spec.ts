import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe.only('Sync Top Stats (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to sync top stats', async () => {
    const { authResponse } = await createAndAuthenticateUser(app)
    const { id } = authResponse.body

    const response = await request(app.server)
      .post(`/snapshot/sync-top-stats?id=${id}`)
      .send()

    console.log(response.body)

    expect(response.body.count).toBe(4)
    expect(response.statusCode).toEqual(201)
  })
})
