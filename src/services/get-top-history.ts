import dayjs from 'dayjs'
import { TimeRange } from '../../generated/prisma/browser'

import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { UsersRepository } from '../repository/user-repository'

interface GetTopHistoryUseCaseRequest {
  userId: string
  entityType: 'ARTIST' | 'TRACK'
  entityId: string
  timeRange: TimeRange
  periodInDays: number
}

interface GetTopHistoryUseCaseResponse {
  history:{

    date: Date
    ranking: number
  }
}

export class GetTopHistoryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private artistRankingsRepository: ArtistRankingsRepository,
    private trackRankingsRepository: TrackRankingsRepository,
    private snapShotRepository: SnapShotsRepository
  ) {}

  async execute({
    entityId,
    entityType,
    periodInDays,
    timeRange,
    userId,
  }: GetTopHistoryUseCaseRequest): Promise<GetTopHistoryUseCaseResponse[]> {
    const snapShots = await this.snapShotRepository.fetchManyByUserId(userId)

    const endDate = dayjs(new Date()).startOf('date')
    const startDate = dayjs(endDate).subtract(periodInDays, 'day')

    snapShots.

  }
}
