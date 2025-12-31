import { randomUUID } from 'node:crypto'
import { TrackRanking } from '../../../generated/prisma/browser'
import { TrackRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import { TrackRankingsRepository } from '../track-rankings-repository'

export class InMemoryTrackRankingsRepository
  implements TrackRankingsRepository
{
  public items: TrackRanking[] = []
  async createMany(
    data: TrackRankingUncheckedCreateInput[]
  ): Promise<TrackRanking[]> {
    const trackRanking = data.map((item) => ({
      id: randomUUID() ?? item.id,
      trackId: item.trackId,
      position: item.position,
      snapshotId: item.snapshotId,
      timeRange: item.timeRange,
    }))
    this.items.push(...trackRanking)
    return trackRanking
  }
}
