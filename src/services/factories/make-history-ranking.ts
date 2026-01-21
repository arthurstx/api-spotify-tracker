import { RedisPlayHistoryStore } from '../../infra/redis/redis-play-history-store'
import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaArtistsRepository } from '../../repository/prisma/prisma-artists-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaTracksRepository } from '../../repository/prisma/prisma-tracks-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { HistoryRankingUseCase } from '../history-ranking'
/*   
 private usersRepository: UsersRepository,
    private artistsRepository: ArtistsRepository,
    private tracksRepository: TracksRepository,
    private artistRankingRepository: ArtistRankingsRepository,
    private tracksRankingRepository: TrackRankingsRepository,
    private snapshotsRepository: SnapShotsRepository,
    private playHistoryCache: PlayHistoryStore,*/

export function makePlayHistoryUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistsRepository = new PrismaArtistsRepository()
  const tracksRepository = new PrismaTracksRepository()
  const artistsRankingRepository = new PrismaArtistsRankingsRepository()
  const tracksRankingRepository = new PrismaTrackRankingsRepository()
  const snapshotRepository = new PrismaSnapshotRepository()
  const playHistoryCache = new RedisPlayHistoryStore()
  const useCase = new HistoryRankingUseCase(
    userRepository,
    artistsRepository,
    tracksRepository,
    artistsRankingRepository,
    tracksRankingRepository,
    snapshotRepository,
    playHistoryCache,
  )

  return useCase
}
