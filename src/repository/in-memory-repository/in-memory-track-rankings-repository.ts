import { randomUUID } from 'node:crypto'
import { TrackRanking } from '../../../generated/prisma/browser'
import { TrackRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import {
  TrackRankingsProps,
  TrackRankingsRepository,
} from '../track-rankings-repository'
import { BatchPayload } from '../../../generated/prisma/internal/prismaNamespace'

export class InMemoryTrackRankingsRepository
  implements TrackRankingsRepository
{
  public items: TrackRanking[] = []

  async fetchManyTrackRankings(
    props: TrackRankingsProps
  ): Promise<TrackRanking[] | []> {
    const trackRankings = this.items.filter(
      (item) =>
        props.trackId === item.trackId &&
        props.snapShotId === item.snapshotId &&
        item.timeRange === props.timeRange
    )
    return trackRankings
  }

  async createMany(data: TrackRankingUncheckedCreateInput[]) {
    const trackRanking = data.map((item) => ({
      id: randomUUID() ?? item.id,
      trackId: item.trackId,
      position: item.position,
      snapshotId: item.snapshotId,
      timeRange: item.timeRange,
    }))
    this.items.push(...trackRanking)
    const batchPayload: { count: number } = {
      count: trackRanking.length,
    }

    return batchPayload as unknown as BatchPayload
  }
}
