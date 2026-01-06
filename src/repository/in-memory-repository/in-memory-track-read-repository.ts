import {
  Artist,
  Snapshot,
  Track,
  TrackArtist,
  TrackRanking,
} from '../../../generated/prisma/browser'
import { TrackReadRepository } from '../track-read-repository'

export class InMemoryTrackReadRepository implements TrackReadRepository {
  constructor(
    public snapshots: Snapshot[] = [],
    public trackRankings: TrackRanking[] = [],
    public tracks: Track[] = [],
    public artists: Artist[] = [],
    public trackArtists: TrackArtist[] = []
  ) {}

  async findByTrackId(trackId: string) {
    const track = this.tracks.find((tr) => tr.id === trackId)

    if (!track) {
      return null
    }

    const trackArtists = this.trackArtists.filter(
      (ta) => ta.trackId === track.id
    )
    const artistsName = trackArtists
      .map((ta) => {
        const artist = this.artists.find((a) => a.id === ta.artistId)
        return artist?.name
      })
      .filter(Boolean)
      .join(', ')

    return {
      id: track.id,
      name: track.name,
      imageUrl: track.imageUrl,
      artistsName: artistsName ?? '',
    }
  }

  async listTrackedByUser(userId: string) {
    const userSnapshots = this.snapshots.filter((s) => s.userId === userId)
    const snapshotIds = userSnapshots.map((s) => s.id)

    const relevantRankings = this.trackRankings.filter((ar) =>
      snapshotIds.includes(ar.snapshotId)
    )

    const uniqueTrackIds = [
      ...new Set(relevantRankings.map((ar) => ar.trackId)),
    ]

    const userTracks = this.tracks.filter((tr) =>
      uniqueTrackIds.includes(tr.id)
    )

    return userTracks.map((track) => {
      const trackArtists = this.trackArtists.filter(
        (ta) => ta.trackId === track.id
      )
      const artistsName = trackArtists
        .map((ta) => {
          const artist = this.artists.filter((a) => a.id === ta.artistId)
          return artist
        })
        .filter(Boolean)
        .join(', ')

      return {
        id: track.id,
        name: track.name,
        imageUrl: track.imageUrl,
        artistsName: artistsName ?? '',
      }
    })
  }
}
