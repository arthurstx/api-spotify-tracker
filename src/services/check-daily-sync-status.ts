import { SnapShotsRepository } from '../repository/snapshots-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface CheckDailySyncStatusUseCaseRequest {
  userId: string
}

interface CheckDailySyncStatusUseCaseResponse {
  snapshotDate?: Date
  hasSnapshotToday: boolean
}

export class CheckDailySyncStatusUseCase {
  constructor(
    private snapshotRepository: SnapShotsRepository,
    private userRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: CheckDailySyncStatusUseCaseRequest): Promise<CheckDailySyncStatusUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const dateNow = new Date()

    const snapshot = await this.snapshotRepository.findByUserAndDate(
      userId,
      dateNow
    )

    const hasSnapshotToday: boolean = snapshot ? true : false

    const snapshotDate = snapshot?.createdAt

    return { snapshotDate, hasSnapshotToday }
  }
}
