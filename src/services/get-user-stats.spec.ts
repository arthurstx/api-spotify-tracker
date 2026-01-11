import { InMemoryTracksRepository } from '../repository/in-memory-repository/in-memory-track-repository'
import { InMemoryArtistsRepository } from '../repository/in-memory-repository/in-memory-artists-repository'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { GetUserStatsUseCase } from './get-user-stats'
import { afterEach } from 'node:test'
import { InMemoryTrackReadRepository } from '../repository/in-memory-repository/in-memory-track-read-repository'
import { InMemoryArtistReadRepository } from '../repository/in-memory-repository/in-memory-artist-read-repository'

let usersRepository: UsersRepository
let artistsReadRepository: InMemoryArtistReadRepository
let tracksReadRepository: InMemoryTrackReadRepository
let snapshotRepository: SnapShotsRepository
let artistsRepository: InMemoryArtistsRepository
let trackRepository: InMemoryTracksRepository
let sut: GetUserStatsUseCase // System Under Test

// TODO: fix me
describe('Get User Stats Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    artistsReadRepository = new InMemoryArtistReadRepository()
    tracksReadRepository = new InMemoryTrackReadRepository()
    snapshotRepository = new InMemorySnapShotsRepository()
    artistsRepository = new InMemoryArtistsRepository()
    trackRepository = new InMemoryTracksRepository()
    sut = new GetUserStatsUseCase(
      snapshotRepository,
      tracksReadRepository,
      artistsReadRepository,
      usersRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to if not exist snapshot today for a user', async () => {
    const user = await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    vi.setSystemTime(new Date(2025, 0, 1, 5))
    const firstSnapshot = await snapshotRepository.create({
      date: new Date(),
      userId: user.id,
    })

    vi.setSystemTime(new Date(2025, 0, 2, 5))
    await snapshotRepository.create({
      date: new Date(),
      userId: user.id,
    })

    vi.setSystemTime(new Date(2025, 0, 3, 5))
    const lastSnapshot = await snapshotRepository.create({
      date: new Date(),
      userId: user.id,
    })

    const [artist] = await artistsRepository.upsertMany([
      {
        name: 'jhon doe',
        spotifyId: 'spotify-01',
      },
    ])

    const [track] = await trackRepository.upsertMany([
      {
        name: 'music',
        durationMs: 2000,
        spotifyId: 'spotify-02',
      },
    ])

    artistsReadRepository.artists.push(artist)
    artistsReadRepository.snapshots.push(firstSnapshot)
    artistsReadRepository.artistRankings.push({
      artistId: artist.id,
      snapshotId: firstSnapshot.id,
      position: 1,
      timeRange: 'SHORT_TERM',
      id: 'artist-ranking-id',
    })

    tracksReadRepository.tracks.push(track)
    tracksReadRepository.snapshots.push(firstSnapshot)
    tracksReadRepository.trackRankings.push({
      trackId: track.id,
      snapshotId: firstSnapshot.id,
      position: 1,
      timeRange: 'SHORT_TERM',
      id: 'track-ranking-id',
    })

    const {
      totalSnapshots,
      totalTrackedArtists,
      totalTrackedTracks,
      firstSnapshotDate,
      lastSnapshotDate,
    } = await sut.execute({
      userId: user.id,
    })

    expect(totalSnapshots).toBe(3)
    expect(totalTrackedArtists).toBe(1)
    expect(totalTrackedTracks).toBe(1)
    expect(firstSnapshotDate).toBe(firstSnapshot.createdAt)
    expect(lastSnapshotDate).toBe(lastSnapshot.createdAt)
  })

  it('should return zero for all stats if user has no snapshots', async () => {
    const user = await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const {
      totalSnapshots,
      totalTrackedArtists,
      totalTrackedTracks,
      firstSnapshotDate,
      lastSnapshotDate,
    } = await sut.execute({
      userId: user.id,
    })

    expect(totalSnapshots).toBe(0)
    expect(totalTrackedArtists).toBe(0)
    expect(totalTrackedTracks).toBe(0)
    expect(firstSnapshotDate).toBeUndefined()
    expect(lastSnapshotDate).toBeUndefined()
  })

  it('should throw error if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
