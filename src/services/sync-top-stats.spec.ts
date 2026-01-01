import { describe, it, expect, beforeEach } from 'vitest'
import { SpotifyProviderMock } from '../provider/mock/SpotifyProviderMock'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { ArtistsRepository } from '../repository/artists-repository'
import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { TracksRepository } from '../repository/tracks-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemoryArtistsRepository } from '../repository/in-memory-repository/in-memory-artists-repository'
import { InMemoryTracksRepository } from '../repository/in-memory-repository/in-memory-track-repository'
import { InMemoryTrackRankingsRepository } from '../repository/in-memory-repository/in-memory-track-rankings-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snap-shots-repository'
import { InMemoryArtistRankingRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-repository'
import { SyncTopStatsUseCase } from './sync-top-stats'

let userRepository: UsersRepository
let artistsRepository: ArtistsRepository
let artistRankingsRepository: ArtistRankingsRepository
let tracksRepository: TracksRepository
let trackRankingsRepository: TrackRankingsRepository
let snapShotsRepository: SnapShotsRepository
let spotifyProvider: SpotifyProviderMock
let sut: SyncTopStatsUseCase

describe('sync top stats use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    artistsRepository = new InMemoryArtistsRepository()
    artistRankingsRepository = new InMemoryArtistRankingRepository()
    tracksRepository = new InMemoryTracksRepository()
    trackRankingsRepository = new InMemoryTrackRankingsRepository()
    snapShotsRepository = new InMemorySnapShotsRepository()
    spotifyProvider = new SpotifyProviderMock()
    sut = new SyncTopStatsUseCase(
      userRepository,
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
})
