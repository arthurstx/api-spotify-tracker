import { PrismaArtistsRepository } from '../../repository/prisma/prisma-artists-repository'
import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaTracksRepository } from '../../repository/prisma/prisma-tracks-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetUserStatsUseCase } from '../get-user-stats'

export function makeGetUserStatsUseCase() {
  const snapshotRepository = new PrismaSnapshotRepository()
  const userRepository = new PrismaUserRepository()
  const trackRepository = new PrismaTracksRepository()
  const artistRepository = new PrismaArtistsRepository()
  const useCase = new GetUserStatsUseCase(
    snapshotRepository,
    trackRepository,
    artistRepository,
    userRepository
  )

  return useCase
}
