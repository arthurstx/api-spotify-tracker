import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaArtistsRepository } from '../../repository/prisma/prisma-artists-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTrackArtistsRepository } from '../../repository/prisma/prisma-track-artists'
import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaTracksRepository } from '../../repository/prisma/prisma-tracks-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { SyncTopStatsUseCase } from '../sync-top-stats'

export function makeSyncTopStatsUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistsRepository = new PrismaArtistsRepository()
  const artistRankingsRepository = new PrismaArtistsRankingsRepository()
  const tracksRepository = new PrismaTracksRepository()
  const trackArtist = new PrismaTrackArtistsRepository()
  const trackRankingsRepository = new PrismaTrackRankingsRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const spotifyProvider = new SpotifyHttpProvider()
  const useCase = new SyncTopStatsUseCase(
    userRepository,
    trackArtist,
    artistsRepository,
    artistRankingsRepository,
    tracksRepository,
    trackRankingsRepository,
    snapShotRepository,
    spotifyProvider
  )

  return useCase
}
