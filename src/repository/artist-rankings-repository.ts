import {
  ArtistRanking,
  Prisma,
  TimeRange,
} from '../../generated/prisma/browser'
import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'

export interface ArtistRankingsProps {
  artistId: string
  timeRange: TimeRange
  snapShotId: string
}

export interface ArtistRankingsRepository {
  fetchManyArtistRankings(props: ArtistRankingsProps): Promise<ArtistRanking[]>
  createMany(
    data: Prisma.ArtistRankingUncheckedCreateInput[]
  ): Promise<ArtistRanking[] | BatchPayload>
}

// with joins

export interface FormatedArtists {
  artist: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
  }>
}

interface history {
  date: Date
  position: number
  timeRange?: TimeRange
}

export interface ArtistRankingsReadRepository {
  fetchHistory(
    userId: string,
    artistId: string,
    timeRange?: TimeRange
  ): Promise<history[]>

  fetchDailyArtistsWithRankings(
    snapshotId: string,
    timeRange: TimeRange
  ): Promise<FormatedArtists>
}
