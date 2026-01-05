import {
  Snapshot,
  TimeRange,
  TrackRanking,
} from '../../../generated/prisma/browser'
import { TrackRankingReadRepository } from '../track-ranking-read-repository'

export class InMemoryTrackRankingReadRepository
  implements TrackRankingReadRepository
{
  public rankings: TrackRanking[] = []
  public snapshots: Snapshot[] = []

  async fetchHistory(userId: string, trackId: string, timeRange?: TimeRange) {
    const userSnapshotIds = this.snapshots
      .filter((s) => s.userId === userId)
      .map((s) => s.id)

    const history = this.rankings
      .filter(
        (r) =>
          userSnapshotIds.includes(r.snapshotId) &&
          r.trackId === trackId &&
          (!timeRange || r.timeRange === timeRange)
      )
      .map((r) => {
        const snapshot = this.snapshots.find((s) => s.id === r.snapshotId)!
        return {
          date: snapshot.date,
          position: r.position,
          timeRange: r.timeRange,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return history
  }
}
