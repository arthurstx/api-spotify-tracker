import { TrackReadRepository } from '../repository/tracks-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface ListTrackedTracksUseCaseRequest {
  userId: string
}

interface ListTrackedTracksUseCaseResponse {
  tracks: Array<{
    id: string
    name: string
    imageUrl?: string | null
    artistsName: string[]
  }>
}

export class ListTrackedTracksUseCase {
  constructor(
    private trackReadRepository: TrackReadRepository,
    private userRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: ListTrackedTracksUseCaseRequest): Promise<ListTrackedTracksUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const tracks = await this.trackReadRepository.listTrackedByUser(userId)

    return { tracks }
  }
}
