import {
  Artist,
  ArtistRanking,
  Snapshot,
} from '../../../generated/prisma/browser'
import { ArtistRankingsReadRepository } from '../artist-rankings-repository'

export class InMemoryArtistRankingsReadRepository implements ArtistRankingsReadRepository {
  constructor(
    public artistRankings: ArtistRanking[],
    public artists: Artist[],
    public snapshot: Snapshot[],
  ) {}

  async fetchHistory(userId: string, artistId: string) {
    const userSnapshotIds = this.snapshot
      .filter((snanpshot) => snanpshot.userId === userId)
      .map((s) => {
        return s.id
      })

    const artistRankings = this.artistRankings.filter(
      (ar) =>
        userSnapshotIds.includes(ar.snapshotId) && ar.artistId === artistId,
    )

    const history = artistRankings.map((ar) => {
      const snanpshot = this.snapshot.find((s) => s.id === ar.snapshotId)!
      return {
        date: snanpshot.createdAt,
        position: ar.position,
      }
    })

    return history
  }

  async fetchDailyArtistsWithRankings(snapshotId: string) {
    const artist = this.artistRankings
      .filter((r) => r.snapshotId === snapshotId)
      .map((r) => {
        const newArtist = this.artists.find((a) => a.id === r.artistId)

        const artist = {
          id: r.artistId,
          name: newArtist?.name ?? 'Unknown',
          imageUrl: newArtist?.imageUrl ?? null,
          position: r.position,
        }

        return artist
      })

    return { artist }
  }
}
