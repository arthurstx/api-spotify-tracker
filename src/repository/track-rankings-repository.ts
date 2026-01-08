import { Prisma, TimeRange, TrackRanking } from '../../generated/prisma/browser'
import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'

export interface TrackRankingsProps {
  trackId: string
  timeRange: TimeRange
  snapShotId: string
}

export interface TrackRankingsRepository {
  fetchManyTrackRankings(props: TrackRankingsProps): Promise<TrackRanking[]>
  createMany(
    data: Prisma.TrackRankingUncheckedCreateInput[]
  ): Promise<TrackRanking[] | BatchPayload>
}

// with joins

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
    artistName: string[]
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
