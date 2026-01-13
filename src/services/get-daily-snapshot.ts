import { TimeRange } from '../../generated/prisma/browser'
import {
  ArtistRankingsReadRepository,
  FormatedArtists,
} from '../repository/artist-rankings-repository'

import { SnapShotsRepository } from '../repository/snapshots-repository'
import {
  FormatedTracks,
  TrackRankingReadRepository,
} from '../repository/track-rankings-repository'
import { UsersRepository } from '../repository/user-repository'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetDailySnapshotUseCaseRequest {
  userId: string
  snapshotDate: Date
  timeRange: TimeRange
}

interface GetDailySnapshotUseCaseResponse {
  snapshotDate: Date
  artists: FormatedArtists['artist']
  tracks: FormatedTracks['track']
}

export class GetDailySnapshotUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private artistRankingRead: ArtistRankingsReadRepository,
    private trackRankingRead: TrackRankingReadRepository,
    private snapShotRepository: SnapShotsRepository
  ) {}

  async execute({
    snapshotDate,
    timeRange,
    userId,
  }: GetDailySnapshotUseCaseRequest): Promise<GetDailySnapshotUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const snapShot = await this.snapShotRepository.findByUserAndDate(
      userId,
      snapshotDate
    )

    if (!snapShot) {
      throw new SnapshotNotFoundError()
    }

    const { artist } =
      await this.artistRankingRead.fetchDailyArtistsWithRankings(
        snapShot.id,
        timeRange
      )

    const { track } = await this.trackRankingRead.fetchDailyTracksWithRankings(
      snapShot.id,
      timeRange
    )

    return {
      snapshotDate,
      artists: artist,
      tracks: track,
    }
  }
}
