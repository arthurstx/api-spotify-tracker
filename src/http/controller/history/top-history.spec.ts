import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { syncTopStatsAndAuth } from '../../../utils/test/sync-top-stats-and-auth'
import { prisma } from '../../../lib/prisma'

describe('Top History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get top history', async () => {
    const { authResponse } = await syncTopStatsAndAuth(app)
    const { id } = authResponse.body

    const { id: trackId } = await prisma.track.findFirstOrThrow()

    const response = await request(app.server)
      .post(`/history/top-history?id=${id}`)
      .send({
        entityType: 'TRACK',
        entityId: trackId,
        periodInDays: 1,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        artists: expect.any(Array),
        tracks: expect.any(Array),
      })
    )
  })
})
