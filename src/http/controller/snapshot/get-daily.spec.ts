import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { syncTopStatsAndAuth } from '../../../utils/test/sync-top-stats-and-auth'
import { TimeRange } from '../../../../generated/prisma/enums'

describe('Get Daily (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get daily snapshot', async () => {
    const { authResponse } = await syncTopStatsAndAuth(app)
    const { id } = authResponse.body

    const response = await request(app.server)
      .post(`/snapshot/get-daily?id=${id}`)
      .send({
        setSnapshotDate: new Date(),
        timeRange: TimeRange.MEDIUM_TERM,
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        artists: expect.any(Array),
        tracks: expect.any(Array),
      })
    )
  })
})
