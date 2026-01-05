import { describe, it, expect, beforeEach } from 'vitest'
import { GetTrackHistoryUseCase } from './get-track-history'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { InMemoryTrackReadRepository } from '../repository/in-memory-repository/in-memory-track-read-repository'
import { InMemoryTrackRankingReadRepository } from '../repository/in-memory-track-ranking-read-repository'
import { TimeRange } from '../../generated/prisma/enums'

let usersRepository: UsersRepository
let trackReadRepository: InMemoryTrackReadRepository
let trackRankingRead: InMemoryTrackRankingReadRepository
let sut: GetTrackHistoryUseCase // System Under Test

describe('Get Track History Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    trackReadRepository = new InMemoryTrackReadRepository()
    trackRankingRead = new InMemoryTrackRankingReadRepository()
    sut = new GetTrackHistoryUseCase(
      trackReadRepository,
      usersRepository,
      trackRankingRead
    )
  })

  it('should be able to get track history for a user', async () => {
    // 1. Setup de dados (Mocks)
    await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    trackReadRepository.artists.push({
      id: 'artist-01',
      name: 'jhon doe',
      createdAt: new Date(),
      imageUrl: 'http://img.com',
      spotifyId: 'spotify_id',
    })

    trackReadRepository.tracks.push({
      id: 'track-1',
      spotifyId: 'track-sp-1',
      name: 'Starboy',
      imageUrl: 'image.png',
      durationMs: 230000,
      createdAt: new Date(),
    })

    trackReadRepository.trackArtists.push({
      id: 'track-artist-1',
      artistId: 'artist-01',
      trackId: 'track-1',
      createdAt: new Date(),
    })

    const snapshotId = 'snap-1'
    trackRankingRead.snapshots.push({
      id: snapshotId,
      userId: 'user-01',
      date: new Date('2023-10-01'),
      createdAt: new Date(),
    })

    trackRankingRead.rankings.push({
      id: 'rank-1',
      snapshotId: snapshotId,
      trackId: 'track-1',
      position: 1,
      timeRange: TimeRange.SHORT_TERM,
    })

    // 2. Execução
    const result = await sut.execute({
      userId: 'user-01',
      trackId: 'track-1',
      timeRange: TimeRange.SHORT_TERM,
    })

    console.log(result.track)

    // 3. Asserções
    expect(result.track.name).toBe('Starboy')
    expect(result.track.artistsName).toBe('jhon doe')
    expect(result.history).toHaveLength(1)
    expect(result.history[0]).toMatchObject({
      position: 1,
      timeRange: 'SHORT_TERM',
    })
  })

  it('should throw error if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent',
        trackId: 'track-1',
      })
    ).rejects.toThrow()
  })
})
