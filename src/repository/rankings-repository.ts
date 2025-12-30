import { Prisma } from '../../generated/prisma/browser'

export interface RankingsRepository {
  createMany(rankings: Prisma.DailyRankingCreateManyInput): Promise<void>
}
