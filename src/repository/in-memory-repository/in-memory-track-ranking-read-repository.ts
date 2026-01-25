import {
  Artist,
  Snapshot,
  Track,
  TrackArtist,
  TrackRanking,
} from '../../../generated/prisma/browser'
import {
  FormatedTracks,
  TrackRankingReadRepository,
} from '../track-rankings-repository'

export class InMemoryTrackRankingReadRepository implements TrackRankingReadRepository {
  fetchDailyTracksWithRankings(snapshotId: string): Promise<FormatedTracks> {
    throw new Error('Method not implemented.')
  }
  public tracksArtist: TrackArtist[] = []
  public tracks: Track[] = []
  public rankings: TrackRanking[] = []
  public snapshots: Snapshot[] = []
  public artists: Artist[] = []

  async fetchDailyArtistsWithRankings(
    snapshotId: string,
  ): Promise<FormatedTracks> {
    const trackRankings = this.rankings.filter(
      (r) => r.snapshotId === snapshotId,
    )

    const track = trackRankings
      .map((ranking) => {
        const track = this.tracks.find((t) => t.id === ranking.trackId)
        if (!track) return null

        const trackArtists = this.tracksArtist
          .filter((ta) => ta.trackId === track.id)
          .map((ta) => {
            const artist = this.artists.find((a) => a.id === ta.artistId)
            return artist?.name ?? 'Unknown Artist'
          })
          .join(', ')

        return {
          id: track.id,
          name: track.name,
          imageUrl: track.imageUrl,
          position: ranking.position,
          artistName: trackArtists,
        }
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)

    return { track }
  }

  async fetchHistory(userId: string, trackId: string) {
    const userSnapshotIds = this.snapshots
      .filter((s) => s.userId === userId)
      .map((s) => s.id)

    const history = this.rankings
      .filter(
        (r) => userSnapshotIds.includes(r.snapshotId) && r.trackId === trackId,
      )
      .map((r) => {
        const snapshot = this.snapshots.find((s) => s.id === r.snapshotId)!
        return {
          date: snapshot.date,
          position: r.position,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return history
  }
}
