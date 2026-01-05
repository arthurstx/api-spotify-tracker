import {
  Snapshot,
  TimeRange,
  TrackRanking,
} from '../../generated/prisma/browser'
import { TrackRankingReadRepository } from '../repository/track-ranking-read-repository'

export class InMemoryTrackRankingReadRepository
  implements TrackRankingReadRepository
{
  public rankings: TrackRanking[] = []
  public snapshots: Snapshot[] = []

  async fetchHistory(userId: string, trackId: string, timeRange?: TimeRange) {
    // 1. Encontrar IDs de snapshots pertencentes ao usuário
    const userSnapshotIds = this.snapshots
      .filter((s) => s.userId === userId)
      .map((s) => s.id)

    // 2. Filtrar rankings que pertencem a esses snapshots e ao trackId
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
          date: snapshot.date.toISOString(),
          position: r.position,
          timeRange: r.timeRange,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return history
  }
}
