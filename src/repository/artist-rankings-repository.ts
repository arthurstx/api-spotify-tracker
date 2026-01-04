import {
  ArtistRanking,
  Prisma,
  TimeRange,
} from '../../generated/prisma/browser'

export interface ArtistRankingsProps {
  artistId: string
  timeRange: TimeRange
  snapShotId: string
}

export interface ArtistRankingsRepository {
  fetchManyArtistRankings(
    props: ArtistRankingsProps
  ): Promise<ArtistRanking[] | []>
  createMany(
    data: Prisma.ArtistRankingUncheckedCreateInput[]
  ): Promise<ArtistRanking[]>
}
