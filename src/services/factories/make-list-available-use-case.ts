import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { ListAvailableSnapshotsUseCase } from '../list-available-snapshots'

export function makeListAvailableUseCase() {
  const userRepository = new PrismaUserRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const useCase = new ListAvailableSnapshotsUseCase(
    userRepository,
    snapShotRepository
  )

  return useCase
}
