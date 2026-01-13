import { InMemoryTrackArtistsRepository } from '../repository/in-memory-repository/in-memory-track-artists-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { SpotifyProviderMock } from '../provider/mock/SpotifyProviderMock'
import type { UsersRepository } from '../repository/user-repository'
import type { ArtistsRepository } from '../repository/artists-repository'
import type { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import type { TracksRepository } from '../repository/tracks-repository'
import type { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemoryArtistsRepository } from '../repository/in-memory-repository/in-memory-artists-repository'
import { InMemoryTracksRepository } from '../repository/in-memory-repository/in-memory-track-repository'
import { InMemoryTrackRankingsRepository } from '../repository/in-memory-repository/in-memory-track-rankings-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { InMemoryArtistRankingRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-repository'
import { SyncTopStatsUseCase } from './sync-top-stats'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SyncAlreadyDoneError } from './errors/sync-already-done-error'
import { TrackArtistsRepository } from '../repository/track-artists-repository'

let userRepository: UsersRepository
let artistsRepository: ArtistsRepository
let artistRankingsRepository: ArtistRankingsRepository
let tracksRepository: TracksRepository
let trackRankingsRepository: TrackRankingsRepository
let snapShotsRepository: SnapShotsRepository
let spotifyProvider: SpotifyProviderMock
let trackArtistsRepository: TrackArtistsRepository
let sut: SyncTopStatsUseCase

describe('sync top stats use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    artistsRepository = new InMemoryArtistsRepository()
    artistRankingsRepository = new InMemoryArtistRankingRepository()
    tracksRepository = new InMemoryTracksRepository()
    trackRankingsRepository = new InMemoryTrackRankingsRepository()
    snapShotsRepository = new InMemorySnapShotsRepository()
    trackArtistsRepository = new InMemoryTrackArtistsRepository()
    spotifyProvider = new SpotifyProviderMock()
    sut = new SyncTopStatsUseCase(
      userRepository,
      trackArtistsRepository,
      artistsRepository,
      artistRankingsRepository,
      tracksRepository,
      trackRankingsRepository,
      snapShotsRepository,
      spotifyProvider
    )
  })

  it('should be able to sync top stats', async () => {
    const userId = 'user-01'

    await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const { count } = await sut.execute({ userId })

    expect(count).toEqual(expect.any(Number))
  })

  it.only('should  be able to refresh token in sync top stats', async () => {
    const userId = 'user-01'

    const user = await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(1),
    })

    const { count } = await sut.execute({ userId })

    expect(user.accessToken).toEqual('new-access-token')
    expect(count).toEqual(4)
  })

  it('should not be able to create snap shot in same day', async () => {
    const userId = 'user-01'

    await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })
    await snapShotsRepository.create({ userId, date: new Date() })

    await expect(sut.execute({ userId })).rejects.toBeInstanceOf(
      SyncAlreadyDoneError
    )
  })
  it('should not be able to sync top stats without user', async () => {
    const userId = 'user-01'

    await expect(sut.execute({ userId })).rejects.toBeInstanceOf(
      UserNotFoundError
    )
  })
})
