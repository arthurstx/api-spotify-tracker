import { randomUUID } from 'node:crypto'
import { DailyRanking } from '../../generated/prisma/browser'
import { DailyRankingCreateManyInput } from '../../generated/prisma/models'
import { RankingsRepository } from './rankings-repository'

export class InMeMoryRankingRepository implements RankingsRepository {
  public items: DailyRanking[] = []
  async createMany(rankings: DailyRankingCreateManyInput) {
    const ranking: DailyRanking = {
      id: rankings.id ?? randomUUID(),
      artistId: rankings.artistId,
      date: new Date(rankings.date),
      position: rankings.position,
    }
    this.items.push(ranking)
  }
}
