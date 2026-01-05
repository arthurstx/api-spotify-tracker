import { TimeRange } from '../../generated/prisma/enums'

interface history {
  date: Date
  position: number
  timeRange: TimeRange
}
export interface TrackRankingReadRepository {
  fetchHistory(
    userId: string,
    trackId: string,
    timeRange?: TimeRange
  ): Promise<history[]>
}
