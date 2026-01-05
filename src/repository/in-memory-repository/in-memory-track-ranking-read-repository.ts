import {
  Snapshot,
  TimeRange,
  Track,
  TrackArtist,
  TrackRanking,
} from '../../../generated/prisma/browser'
import {
  FormatedTracks,
  TrackRankingReadRepository,
} from '../track-ranking-read-repository'

export class InMemoryTrackRankingReadRepository
  implements TrackRankingReadRepository
{
  public tracksArtist: TrackArtist[] = []
  public tracks: Track[] = []
  public rankings: TrackRanking[] = []
  public snapshots: Snapshot[] = []
  /*
    track: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
    artistName: string
  }>
*/
  async fetchDailyArtistsWithRankings(
    snapshotId: string,
    timeRange: TimeRange
  ) {
    const TrackRanking = this.rankings
      .filter((r) => r.snapshotId === snapshotId && timeRange === r.timeRange)
      .map((tr) => {
        const tracks = this.tracks.filter((t) => t.id === tr.trackId)
        return tracks
      })
  }

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
