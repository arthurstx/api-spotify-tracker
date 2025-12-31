import { Prisma, TrackRanking } from '../../generated/prisma/browser'

export interface TrackRankingsRepository {
  createMany(data: Prisma.TrackRankingCreateInput[]): Promise<TrackRanking[]>
}
