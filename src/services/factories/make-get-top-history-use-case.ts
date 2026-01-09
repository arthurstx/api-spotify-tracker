import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetTopHistoryUseCase } from '../get-top-history'

export function makeGetTopHistoryUseCase() {
  const userRepository = new PrismaUserRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const artistRankings = new PrismaArtistsRankingsRepository()
  const trackRankingRepository = new PrismaTrackRankingsRepository()
  const useCase = new GetTopHistoryUseCase(
    userRepository,
    artistRankings,
    trackRankingRepository,
    snapShotRepository
  )

  return useCase
}
