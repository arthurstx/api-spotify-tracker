import { ArtistsRepository } from '../repository/artists-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TracksRepository } from '../repository/tracks-repository'
import { UsersRepository } from '../repository/user-repository'
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
    private artistsRepository: ArtistsRepository,
    private tracksRepository: TracksRepository,
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

    const artists = await this.artistsRepository.fetchManyByUserId(userId)

    const tracks = await this.tracksRepository.fetchManyByUserId(userId)

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
