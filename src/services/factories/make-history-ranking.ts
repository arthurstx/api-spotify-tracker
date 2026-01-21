import { RedisPlayHistoryStore } from '../../infra/redis/redis-play-history-store'
import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { HistoryRankingUseCase } from '../history-ranking'

export function makePlayHistoryUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistsRankingRepository = new PrismaArtistsRankingsRepository()
  const tracksRankingRepository = new PrismaTrackRankingsRepository()
  const snapshotRepository = new PrismaSnapshotRepository()
  const playHistoryCache = new RedisPlayHistoryStore()
  const useCase = new HistoryRankingUseCase(
    userRepository,
    artistsRankingRepository,
    tracksRankingRepository,
    snapshotRepository,
    playHistoryCache,
  )

  return useCase
}
