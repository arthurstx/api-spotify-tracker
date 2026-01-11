import { SnapShotsRepository } from '../repository/snapshots-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface ListAvailableSnapshotsUseCaseRequest {
  userId: string
}

interface ListAvailableSnapshotsUseCaseResponse {
  snapshotDate: Date[]
}

export class ListAvailableSnapshotsUseCase {
  constructor(
    private userRepository: UsersRepository,
    private snapshotRepository: SnapShotsRepository
  ) {}

  async execute({
    userId,
  }: ListAvailableSnapshotsUseCaseRequest): Promise<ListAvailableSnapshotsUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const snapshotDate =
      await this.snapshotRepository.fetchManySnapshotDatesByUserId(userId)

    return { snapshotDate }
  }
}
