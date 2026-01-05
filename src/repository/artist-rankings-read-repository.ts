import { TimeRange } from '../../generated/prisma/enums'

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
