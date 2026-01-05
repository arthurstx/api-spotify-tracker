import { TimeRange } from '../../generated/prisma/enums'

export interface FormatedArtists {
  artist: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
  }>
}

export interface ArtistRankingsReadRepository {
  fetchDailyArtistsWithRankings(
    snapshotId: string,
    timeRange: TimeRange
  ): Promise<FormatedArtists>
}
