import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { syncTopStatsAndAuth } from '../../../utils/test/sync-top-stats-and-auth'

describe('Track History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get track history', async () => {
    const { authResponse } = await syncTopStatsAndAuth(app)
    const { id } = authResponse.body

    const { id: trackId } = await prisma.track.findFirstOrThrow()

    const response = await request(app.server)
      .post(`/history/track-history?id=${id}`)
      .send({ trackId })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        track: expect.objectContaining({
          name: expect.any(String),
          imageUrl: expect.any(String),
        }),
        history: expect.any(Array),
      })
    )
  })
})
