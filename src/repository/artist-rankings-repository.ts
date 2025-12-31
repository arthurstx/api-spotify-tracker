import { ArtistRanking, Prisma } from '../../generated/prisma/browser'

export interface ArtistRankingsRepository {
  createMany(
    data: Prisma.ArtistRankingUncheckedCreateInput[]
  ): Promise<ArtistRanking[]>
}
