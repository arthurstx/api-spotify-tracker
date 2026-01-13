import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { syncTopStatsAndAuth } from '../../../utils/test/sync-top-stats-and-auth'
import { prisma } from '../../../lib/prisma'

describe('Artist History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get artist history', async () => {
    const { authResponse } = await syncTopStatsAndAuth(app)
    const { id } = authResponse.body

    const { id: artistId } = await prisma.artist.findFirstOrThrow()

    const response = await request(app.server)
      .post(`/history/artist-history?id=${id}`)
      .send({ artistId: artistId })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        artist: expect.objectContaining({
          name: expect.any(String),
          genres: expect.any(Array),
          imageUrl: expect.any(String),
        }),
        history: expect.any(Array),
      })
    )
  })
})
