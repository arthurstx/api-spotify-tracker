import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetLatestTopArtistsseCase } from '../get-latest-top-artists'

export function makeGetLatestTopArtistsUseCase() {
  const userRepository = new PrismaUserRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const artistRankings = new PrismaArtistsRankingsRepository()
  const useCase = new GetLatestTopArtistsseCase(
    snapShotRepository,
    userRepository,
    artistRankings
  )

  return useCase
}
