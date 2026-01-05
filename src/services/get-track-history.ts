import { TimeRange } from '../../generated/prisma/enums'
import { TrackRankingReadRepository } from '../repository/track-ranking-read-repository'
import { TrackReadRepository } from '../repository/track-read-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetTrackHistoryUseCaseRequest {
  userId: string
  trackId: string
  timeRange?: TimeRange
}

interface GetTrackHistoryUseCaseResponse {
  track: {
    id: string
    name: string
    imageUrl: string | null
    artistsName: string
  }

  history: Array<{
    date: string
    position: number
    timeRange: TimeRange
  }>
}

export class GetTrackHistoryUseCase {
  constructor(
    private trackReadRepository: TrackReadRepository,
    private userRepository: UsersRepository,
    private trackRankingRead: TrackRankingReadRepository
  ) {}

  async execute({
    userId,
    trackId,
    timeRange,
  }: GetTrackHistoryUseCaseRequest): Promise<GetTrackHistoryUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const track = await this.trackReadRepository.findByTrackId(trackId)

    if (!track) {
      throw new Error()
    }

    const history = await this.trackRankingRead.fetchHistory(
      userId,
      trackId,
      timeRange
    )

    return { track, history }
  }
}
