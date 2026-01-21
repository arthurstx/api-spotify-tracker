import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { PlayHistoryStore } from '../applications/ports/play-history-store'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TimeRange } from '../../generated/prisma/browser'
import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'

interface HistoryRankingUseCaseRequest {
  userId: string
}

interface HistoryRankingUseCaseResponse {
  count: number
}

export class HistoryRankingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private artistRankingRepository: ArtistRankingsRepository,
    private tracksRankingRepository: TrackRankingsRepository,
    private snapshotsRepository: SnapShotsRepository,
    private playHistoryCache: PlayHistoryStore,
  ) {}

  async execute({
    userId,
  }: HistoryRankingUseCaseRequest): Promise<HistoryRankingUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const snapshot = await this.snapshotsRepository.create({
      userId,
      date: new Date(),
    })

    const artistiIdWithFrequency =
      await this.playHistoryCache.getArtistsRanking(userId)
    const trackIdWithFrequency =
      await this.playHistoryCache.getTracksRanking(userId)

    return { count: 3 }
  }
}
