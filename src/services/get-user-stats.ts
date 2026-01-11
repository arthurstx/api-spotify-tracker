import { ArtistReadRepository } from '../repository/artists-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TrackReadRepository } from '../repository/tracks-repository'
import { UsersRepository } from '../repository/user-repository'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetUserStatsUseCaseRequest {
  userId: string
}

interface GetUserStatsUseCaseResponse {
  totalSnapshots: number
  firstSnapshotDate?: Date
  lastSnapshotDate?: Date

  totalTrackedArtists: number
  totalTrackedTracks: number

  // daysTracked: number TODO: ADD ME
}

export class GetUserStatsUseCase {
  constructor(
    private snapshotRepository: SnapShotsRepository,
    private tracksReadRepository: TrackReadRepository,
    private artistsReadRepository: ArtistReadRepository,
    private userRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserStatsUseCaseRequest): Promise<GetUserStatsUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const snapshots = await this.snapshotRepository.fetchManyByUserId(userId)

    if (snapshots.length === 0) {
      return {
        totalSnapshots: 0,
        totalTrackedArtists: 0,
        totalTrackedTracks: 0,
        firstSnapshotDate: undefined,
        lastSnapshotDate: undefined,
      }
    }

    const artists = await this.artistsReadRepository.listTrackedByUser(userId)

    const tracks = await this.tracksReadRepository.listTrackedByUser(userId)

    const totalSnapshots = snapshots.length

    const firstSnapshotDate = snapshots[0].createdAt

    const lastSnapshotDate = snapshots[totalSnapshots - 1].createdAt

    const totalTrackedArtists = artists.length

    const totalTrackedTracks = tracks.length

    return {
      totalSnapshots,
      firstSnapshotDate,
      lastSnapshotDate,
      totalTrackedArtists,
      totalTrackedTracks,
    }
  }
}
