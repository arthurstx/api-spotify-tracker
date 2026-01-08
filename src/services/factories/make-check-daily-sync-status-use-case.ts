import { PrismaSnapshotRepository } from '../../repository/prisma/prisma-snapshots-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { CheckDailySyncStatusUseCase } from '../check-daily-sync-status'

export function makeCheckDailySyncStatusUseCase() {
  const userRepository = new PrismaUserRepository()
  const snapShotRepository = new PrismaSnapshotRepository()
  const useCase = new CheckDailySyncStatusUseCase(
    snapShotRepository,
    userRepository
  )

  return useCase
}
