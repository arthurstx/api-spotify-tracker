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

    expect(response.statusCode).toBe(200)

    expect(response.body).toMatchObject({
      artist: {
        id: expect.any(String),
        name: expect.any(String),
        imageUrl: expect.any(String),
        spotifyId: expect.any(String),
        createdAt: expect.any(String),
      },
      history: expect.arrayContaining([
        {
          position: expect.any(Number),
          timeRange: expect.any(String),
          date: expect.any(String),
        },
      ]),
    })
  })
})
