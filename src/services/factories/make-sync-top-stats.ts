import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { RedisPlayHistoryStore } from '../../infra/redis/redis-play-history-store'
import { SpotifyProviderMock } from '../../provider/mock/SpotifyProviderMock'
import { PrismaArtistsRepository } from '../../repository/prisma/prisma-artists-repository'
import { PrismaTrackArtistsRepository } from '../../repository/prisma/prisma-track-artists'
import { PrismaTracksRepository } from '../../repository/prisma/prisma-tracks-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { SyncTopStatsUseCase } from '../sync-top-stats'

export function makeSyncTopStatsUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistsRepository = new PrismaArtistsRepository()
  const tracksRepository = new PrismaTracksRepository()
  const trackArtist = new PrismaTrackArtistsRepository()
  const playHistoryCache = new RedisPlayHistoryStore()
  const spotifyProvider =
    process.env.NODE_ENV === 'test'
      ? new SpotifyProviderMock()
      : new SpotifyHttpProvider()
  const useCase = new SyncTopStatsUseCase(
    userRepository,
    trackArtist,
    artistsRepository,
    tracksRepository,
    spotifyProvider,
    playHistoryCache,
  )

  return useCase
}
