import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetLatestTopTracksUseCase } from '../get-latest-top-tracks'

export function makeGetLatestTopTrackUseCase() {
  const userRepository = new PrismaUserRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const artistRankings = new PrismaTrackRankingsRepository()
  const useCase = new GetLatestTopTracksUseCase(
    snapShotRepository,
    userRepository,
    artistRankings
  )

  return useCase
}
