import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetDailySnapshotUseCase } from '../get-daily-snapshot'

export function makeGetDailySnapshotUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistRankingsRepository = new PrismaArtistsRankingsRepository()
  const trackRankingsRepository = new PrismaTrackRankingsRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const useCase = new GetDailySnapshotUseCase(
    userRepository,
    artistRankingsRepository,
    trackRankingsRepository,
    snapShotRepository
  )

  return useCase
}
