import { beforeEach, describe, expect, it } from 'vitest'
import { GetDailySnapshotUseCase } from './get-daily-snapshot'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { InMemoryArtistRankingsReadRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-read-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'
import { randomUUID } from 'crypto'
import {
  Artist,
  TimeRange,
  Track,
  TrackArtist,
} from '../../generated/prisma/browser'
import { InMemoryTrackRankingReadRepository } from '../repository/in-memory-repository/in-memory-track-ranking-read-repository'

describe('Get Daily Snapshot Use Case', () => {
  let userRepository: InMemoryUserRepository
  let artistRankingsReadRepository: InMemoryArtistRankingsReadRepository
  let trackRankingReadRepository: InMemoryTrackRankingReadRepository
  let snapShotRepository: InMemorySnapShotsRepository
  let sut: GetDailySnapshotUseCase

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    artistRankingsReadRepository = new InMemoryArtistRankingsReadRepository(
      [],
      [],
      []
    )
    trackRankingReadRepository = new InMemoryTrackRankingReadRepository()
    snapShotRepository = new InMemorySnapShotsRepository()
    sut = new GetDailySnapshotUseCase(
      userRepository,
      artistRankingsReadRepository,
      trackRankingReadRepository,
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

  it('should be able to get a daily snapshot with artists and tracks', async () => {
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

    const track = {
      id: 'track-id',
      name: 'Track Name',
      imageUrl: 'http://example.com/track.jpg',
      durationMs: 180000,
      createdAt: new Date(),
    } as Track
    trackRankingReadRepository.tracks.push(track)
    trackRankingReadRepository.rankings.push({
      id: randomUUID(),
      snapshotId: snapshot.id,
      trackId: track.id,
      position: 1,
      timeRange: TimeRange.MEDIUM_TERM,
    })
    trackRankingReadRepository.artists.push(artist)

    const trackArtist: TrackArtist = {
      trackId: track.id,
      artistId: artist.id,
    }
    trackRankingReadRepository.tracksArtist.push(trackArtist)

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

    expect(result.formatedTracks.track).toHaveLength(1)
    expect(result.formatedTracks.track[0]).toEqual({
      id: 'track-id',
      name: 'Track Name',
      imageUrl: 'http://example.com/track.jpg',
      position: 1,
      artistName: 'Artist Name',
    })
  })

  it('should return empty arrays when no artists or tracks are ranked for the snapshot', async () => {
    const user = await userRepository.create({
      id: 'user-id',
      spotifyId: 'user-id',
      displayName: 'Test User',
      accessToken: 'test-token',
      refreshToken: 'test-refresh-token',
      tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    })

    const snapshotDate = new Date()
    await snapShotRepository.create({
      id: 'snapshot-id',
      userId: user.id,
      date: snapshotDate,
    })

    const result = await sut.execute({
      userId: user.id,
      snapshotDate,
      timeRange: TimeRange.LONG_TERM,
    })

    expect(result.snapshotDate).toEqual(snapshotDate)
    expect(result.formatedArtists.artist).toHaveLength(0)
    expect(result.formatedTracks.track).toHaveLength(0)
  })
})
