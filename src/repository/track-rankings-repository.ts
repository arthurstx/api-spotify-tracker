import { Prisma, TrackRanking } from '../../generated/prisma/browser'

export interface TrackRankingsRepository {
  upsertMany(data: Prisma.TrackRankingCreateInput): Promise<TrackRanking>
}
