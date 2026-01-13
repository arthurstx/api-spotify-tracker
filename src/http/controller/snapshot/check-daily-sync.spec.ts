import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { syncTopStatsAndAuth } from '../../../utils/test/sync-top-stats-and-auth'

describe('Check Daily Sync (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to check daily sync', async () => {
    const { authResponse } = await syncTopStatsAndAuth(app)
    const { id } = authResponse.body

    const response = await request(app.server)
      .get(`/snapshot/sync-status?id=${id}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        hasSnapshotToday: expect.any(Boolean),
        snapshotDate: expect.any(String),
      })
    )
  })
})
