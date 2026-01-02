import {
  ArtistRanking,
  Prisma,
  TimeRange,
} from '../../generated/prisma/browser'

export interface ArtistRankingsRepository {
  fetchManyTrackRankings(
    artist: string,
    timeRange: TimeRange,
    snapShotId: string
  ): Promise<ArtistRanking[]>
  createMany(
    data: Prisma.ArtistRankingUncheckedCreateInput[]
  ): Promise<ArtistRanking[]>
}
