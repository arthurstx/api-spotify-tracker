import { TimeRange } from '../../generated/prisma/enums'

interface history {
  date: Date
  position: number
  timeRange: TimeRange
}
export interface FormatedTracks {
  track: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
    artistName: string
  }>
}

export interface TrackRankingReadRepository {
  fetchDailyArtistsWithRankings(
    snapshotId: string,
    timeRange: TimeRange
  ): Promise<FormatedTracks>
  fetchHistory(
    userId: string,
    trackId: string,
    timeRange?: TimeRange
  ): Promise<history[]>
}
