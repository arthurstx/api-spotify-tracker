import { ArtistRanking, Prisma } from '../../generated/prisma/browser'

export interface ArtistRankingsRepository {
  createMany(data: Prisma.ArtistRankingCreateInput[]): Promise<ArtistRanking[]>
}
