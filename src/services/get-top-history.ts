import dayjs from 'dayjs'

import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetTopHistoryUseCaseRequest {
  userId: string
  entityType: 'ARTIST' | 'TRACK'
  entityId: string
  periodInDays: number
}

interface GetTopHistoryUseCaseResponse {
  history: {
    date: Date
    ranking: number
  }[]
}

export class GetTopHistoryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private artistRankingsRepository: ArtistRankingsRepository,
    private trackRankingsRepository: TrackRankingsRepository,
    private snapShotRepository: SnapShotsRepository,
  ) {}

  async execute({
    entityId,
    entityType,
    periodInDays,
    userId,
  }: GetTopHistoryUseCaseRequest): Promise<GetTopHistoryUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const endDate = dayjs().startOf('day')
    const startDate = endDate.subtract(periodInDays, 'day')

    const snapShots = await this.snapShotRepository.fetchManyByUserIdAndPeriod(
      userId,
      startDate.toDate(),
      endDate.toDate(),
    )

    const historyNested = await Promise.all(
      snapShots.map(async (item) => {
        if (entityType === 'ARTIST') {
          const artistsRanking =
            await this.artistRankingsRepository.fetchManyArtistRankings({
              snapShotId: item.id,
              artistId: entityId,
            })

          return artistsRanking.map((artist) => ({
            date: item.createdAt,
            ranking: artist.position,
          }))
        } else if (entityType === 'TRACK') {
          const trackRanking =
            await this.trackRankingsRepository.fetchManyTrackRankings({
              snapShotId: item.id,
              trackId: entityId,
            })

          return trackRanking.map((track) => ({
            date: item.createdAt,
            ranking: track.position,
          }))
        }
        return []
      }),
    )

    const history = historyNested.flat()

    return { history }
  }
}
