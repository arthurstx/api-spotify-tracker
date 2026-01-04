import { Prisma, TimeRange, TrackRanking } from '../../generated/prisma/browser'

export interface TrackRankingsProps {
  trackId: string
  timeRange: TimeRange
  snapShotId: string
}

export interface TrackRankingsRepository {
  fetchManyTrackRankings(
    props: TrackRankingsProps
  ): Promise<TrackRanking[] | []>
  createMany(
    data: Prisma.TrackRankingUncheckedCreateInput[]
  ): Promise<TrackRanking[]>
}
