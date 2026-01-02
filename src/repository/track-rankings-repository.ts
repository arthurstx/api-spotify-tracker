import { Prisma, TimeRange, TrackRanking } from '../../generated/prisma/browser'

export interface TrackRankingsRepository {
  fetchManyTrackRankings(
    artist: string,
    timeRange: TimeRange,
    snapShotId: string
  ): Promise<TrackRanking[]>
  createMany(
    data: Prisma.TrackRankingUncheckedCreateInput[]
  ): Promise<TrackRanking[]>
}
