import { TimeRange } from '../../generated/prisma/enums'
import { ArtistRankingsReadRepository } from '../repository/artist-rankings-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { UsersRepository } from '../repository/user-repository'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetLatestTopArtistsseCaseRequest {
  userId: string
  timeRange: TimeRange
}

interface GetLatestTopArtistsseCaseResponse {
  snapshotDate: Date

  artist: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
  }>
}

export class GetLatestTopArtistsseCase {
  constructor(
    private snapshotRepository: SnapShotsRepository,
    private userRepository: UsersRepository,
    private artistRankingsRead: ArtistRankingsReadRepository
  ) {}

  async execute({
    userId,
    timeRange,
  }: GetLatestTopArtistsseCaseRequest): Promise<GetLatestTopArtistsseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const snapshot = await this.snapshotRepository.findLatest(userId)

    if (!snapshot) {
      throw new SnapshotNotFoundError()
    }

    const { artist } =
      await this.artistRankingsRead.fetchDailyArtistsWithRankings(
        snapshot.id,
        timeRange
      )

    return { snapshotDate: snapshot.createdAt, artist }
  }
}
