import { describe, it, expect, beforeEach } from 'vitest'
import type { UsersRepository } from '../repository/user-repository'
import type { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import type { TrackRankingsRepository } from '../repository/track-rankings-repository'
import type { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { InMemoryTrackRankingsRepository } from '../repository/in-memory-repository/in-memory-track-rankings-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { InMemoryArtistRankingRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-repository'
import { GetTopHistoryUseCase } from './get-top-history'
import { TimeRange } from '../../generated/prisma/browser'
import dayjs from 'dayjs'
import { UserNotFoundError } from './errors/user-not-found-error'

let userRepository: UsersRepository
let artistRankingsRepository: ArtistRankingsRepository
let trackRankingsRepository: TrackRankingsRepository
let snapShotsRepository: SnapShotsRepository
let sut: GetTopHistoryUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    artistRankingsRepository = new InMemoryArtistRankingRepository()
    trackRankingsRepository = new InMemoryTrackRankingsRepository()
    snapShotsRepository = new InMemorySnapShotsRepository()
    sut = new GetTopHistoryUseCase(
      userRepository,
      artistRankingsRepository,
      trackRankingsRepository,
      snapShotsRepository
    )
  })

  it('should be able get  artist rankings history', async () => {
    const user = await userRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const date = dayjs(new Date()).subtract(10, 'days').toDate()

    const snapShot = await snapShotsRepository.create({ userId: user.id, date })

    const artistRankings = [
      {
        id: 'artist-ranking-01',
        artistId: 'artist-01',
        position: 1,
        snapshotId: snapShot.id,
        timeRange: 'MEDIUM_TERM' as TimeRange,
      },
    ]
    await artistRankingsRepository.createMany(artistRankings)

    const { history } = await sut.execute({
      entityId: artistRankings[0].artistId,
      entityType: 'ARTIST',
      periodInDays: 20,
      timeRange: 'MEDIUM_TERM',
      userId: user.id,
    })

    expect(history[0].ranking).toEqual(1)
  })
  it('should be able get tracks rankings history', async () => {
    const user = await userRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const date = dayjs(new Date()).subtract(10, 'days').toDate()

    const snapShot = await snapShotsRepository.create({ userId: user.id, date })

    const trackRankings = [
      {
        id: 'artist-ranking-01',
        trackId: 'artist-01',
        position: 1,
        snapshotId: snapShot.id,
        timeRange: 'MEDIUM_TERM' as TimeRange,
      },
    ]
    await trackRankingsRepository.createMany(trackRankings)

    const { history } = await sut.execute({
      entityId: trackRankings[0].trackId,
      entityType: 'TRACK',
      periodInDays: 20,
      timeRange: 'MEDIUM_TERM',
      userId: user.id,
    })

    expect(history[0].ranking).toEqual(1)
  })
  it('should be able get tracks rankings history', async () => {
    const user = await userRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const date = dayjs(new Date()).subtract(10, 'days').toDate()

    const snapShot = await snapShotsRepository.create({ userId: user.id, date })

    const trackRankings = [
      {
        id: 'track-ranking-01',
        trackId: 'track-01',
        position: 1,
        snapshotId: snapShot.id,
        timeRange: 'MEDIUM_TERM' as TimeRange,
      },
    ]
    await trackRankingsRepository.createMany(trackRankings)

    const { history } = await sut.execute({
      entityId: trackRankings[0].trackId,
      entityType: 'TRACK',
      periodInDays: 20,
      timeRange: 'MEDIUM_TERM',
      userId: user.id,
    })

    expect(history[0].ranking).toEqual(1)
  })

  it('should not be able get ranking if entity type is not defined ', async () => {
    const user = await userRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const date = dayjs(new Date()).subtract(10, 'days').toDate()

    const snapShot = await snapShotsRepository.create({ userId: user.id, date })

    const trackRankings = [
      {
        id: 'artist-ranking-01',
        trackId: 'artist-01',
        position: 1,
        snapshotId: snapShot.id,
        timeRange: 'MEDIUM_TERM' as TimeRange,
      },
    ]
    await trackRankingsRepository.createMany(trackRankings)

    const { history } = await sut.execute({
      entityId: trackRankings[0].trackId,
      entityType: '' as 'TRACK' | 'ARTIST',
      periodInDays: 20,
      timeRange: 'MEDIUM_TERM',
      userId: user.id,
    })

    expect(history).toEqual([])
  })

  it('should not be able get artist rankings history without user', async () => {
    const date = dayjs(new Date()).subtract(10, 'days').toDate()

    const snapShot = await snapShotsRepository.create({
      userId: 'user not found',
      date,
    })

    const artistRankings = [
      {
        id: 'artist-ranking-01',
        artistId: 'artist-01',
        position: 1,
        snapshotId: snapShot.id,
        timeRange: 'MEDIUM_TERM' as TimeRange,
      },
    ]
    await artistRankingsRepository.createMany(artistRankings)

    await expect(
      sut.execute({
        entityId: artistRankings[0].artistId,
        entityType: 'ARTIST',
        periodInDays: 20,
        timeRange: 'MEDIUM_TERM',
        userId: 'user not found',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
