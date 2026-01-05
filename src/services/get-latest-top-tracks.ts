import { TimeRange } from '../../generated/prisma/enums'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TrackRankingReadRepository } from '../repository/track-ranking-read-repository'
import { UsersRepository } from '../repository/user-repository'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetLatestTopTracksUseCaseRequest {
  userId: string
  timeRange: TimeRange
}

interface GetLatestTopTracksUseCaseResponse {
  snapshotDate: Date

  track: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
    artistName: string
  }>
}

export class GetLatestTopTracksUseCase {
  constructor(
    private snapshotRepository: SnapShotsRepository,
    private userRepository: UsersRepository,
    private trackRankingRead: TrackRankingReadRepository
  ) {}

  async execute({
    userId,
    timeRange,
  }: GetLatestTopTracksUseCaseRequest): Promise<GetLatestTopTracksUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const snapshot = await this.snapshotRepository.findLatest(userId)

    if (!snapshot) {
      throw new SnapshotNotFoundError()
    }

    const { track } = await this.trackRankingRead.fetchDailyArtistsWithRankings(
      snapshot.id,
      timeRange
    )

    return { snapshotDate: snapshot.createdAt, track }
  }
}
