import { SnapShotsRepository } from '../repository/snapshots-repository'

interface ListAvailableSnapshotsUseCaseRequest {
  userId: string
}

interface ListAvailableSnapshotsUseCaseResponse {
  snapshotDate: Date[]
}

export class ListAvailableSnapshotsUseCase {
  constructor(private snapshotRepository: SnapShotsRepository) {}

  async execute({
    userId,
  }: ListAvailableSnapshotsUseCaseRequest): Promise<ListAvailableSnapshotsUseCaseResponse> {
    const snapshotDate =
      await this.snapshotRepository.fetchManySnapshotDatesByUserId(userId)

    return { snapshotDate }
  }
}
