import { beforeEach, describe, expect, it } from 'vitest'
import { GetDailySnapshotUseCase } from './get-daily-snapshot'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { InMemoryArtistRankingsReadRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-read-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'
import { randomUUID } from 'crypto'
import { Artist, TimeRange } from '../../generated/prisma/browser'

describe('Get Daily Snapshot Use Case', () => {
  let userRepository: InMemoryUserRepository
  let artistRankingsReadRepository: InMemoryArtistRankingsReadRepository
  let snapShotRepository: InMemorySnapShotsRepository
  let sut: GetDailySnapshotUseCase

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    artistRankingsReadRepository = new InMemoryArtistRankingsReadRepository(
      [],
      []
    )
    snapShotRepository = new InMemorySnapShotsRepository()
    sut = new GetDailySnapshotUseCase(
      userRepository,
      artistRankingsReadRepository,
      snapShotRepository
    )
  })

  it('should not be able to get a daily snapshot if the user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existing-user-id',
        snapshotDate: new Date(),
        timeRange: TimeRange.MEDIUM_TERM,
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to get a daily snapshot if the snapshot does not exist', async () => {
    const user = await userRepository.create({
      id: 'user-id',
      spotifyId: 'user-id',
      displayName: 'Test User',
      accessToken: 'test-token',
      refreshToken: 'test-refresh-token',
      tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    })

    await expect(
      sut.execute({
        userId: user.id,
        snapshotDate: new Date(),
        timeRange: TimeRange.MEDIUM_TERM,
      })
    ).rejects.toBeInstanceOf(SnapshotNotFoundError)
  })

  it('should be able to get a daily snapshot', async () => {
    const user = await userRepository.create({
      id: 'user-id',
      spotifyId: 'user-id',
      displayName: 'Test User',
      accessToken: 'test-token',
      refreshToken: 'test-refresh-token',
      tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    })

    const snapshotDate = new Date()
    const snapshot = await snapShotRepository.create({
      id: 'snapshot-id',
      userId: user.id,
      date: snapshotDate,
    })

    const artist = {
      id: 'artist-id',
      name: 'Artist Name',
      imageUrl: 'http://example.com/image.jpg',
      createdAt: new Date(),
    } as Artist

    artistRankingsReadRepository.artists.push(artist)
    artistRankingsReadRepository.artistRankings.push({
      id: randomUUID(),
      snapshotId: snapshot.id,
      artistId: artist.id,
      position: 1,
      timeRange: TimeRange.MEDIUM_TERM,
    })

    const result = await sut.execute({
      userId: user.id,
      snapshotDate,
      timeRange: TimeRange.MEDIUM_TERM,
    })

    expect(result.snapshotDate).toEqual(snapshotDate)
    expect(result.formatedArtists.artist).toHaveLength(1)
    expect(result.formatedArtists.artist[0]).toEqual({
      id: 'artist-id',
      name: 'Artist Name',
      imageUrl: 'http://example.com/image.jpg',
      position: 1,
    })
  })
})
