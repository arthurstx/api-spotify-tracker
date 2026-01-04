import { describe, it, expect, beforeEach } from 'vitest'
import type { UsersRepository } from '../repository/user-repository'
import type { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import type { TrackRankingsRepository } from '../repository/track-rankings-repository'
import type { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { InMemoryTrackRankingsRepository } from '../repository/in-memory-repository/in-memory-track-rankings-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snap-shots-repository'
import { InMemoryArtistRankingRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-repository'
import { GetTopHistoryUseCase } from './get-top-history'
import { TimeRange } from '../../generated/prisma/browser'
import dayjs from 'dayjs'

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

    const snapShot = await snapShotsRepository.create(user.id, date)

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
})
