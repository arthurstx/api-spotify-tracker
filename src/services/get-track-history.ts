import { TrackRankingReadRepository } from '../repository/track-rankings-repository'
import { TrackReadRepository } from '../repository/tracks-repository'
import { UsersRepository } from '../repository/user-repository'
import { TrackNotFoundError } from './errors/track-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetTrackHistoryUseCaseRequest {
  userId: string
  trackId: string
}

interface GetTrackHistoryUseCaseResponse {
  track: {
    id: string
    name: string
    imageUrl: string | null
    artistsName: string[]
  }

  history: Array<{
    date: Date
    position: number
  }>
}

export class GetTrackHistoryUseCase {
  constructor(
    private trackReadRepository: TrackReadRepository,
    private userRepository: UsersRepository,
    private trackRankingRead: TrackRankingReadRepository,
  ) {}

  async execute({
    userId,
    trackId,
  }: GetTrackHistoryUseCaseRequest): Promise<GetTrackHistoryUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const track = await this.trackReadRepository.findByTrackId(trackId)

    if (!track) {
      throw new TrackNotFoundError()
    }

    const history = await this.trackRankingRead.fetchHistory(userId, trackId)

    return { track, history }
  }
}
