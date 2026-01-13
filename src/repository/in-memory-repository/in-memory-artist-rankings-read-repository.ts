import {
  Artist,
  ArtistRanking,
  Snapshot,
  TimeRange,
} from '../../../generated/prisma/browser'
import { ArtistRankingsReadRepository } from '../artist-rankings-repository'

export class InMemoryArtistRankingsReadRepository
  implements ArtistRankingsReadRepository
{
  constructor(
    public artistRankings: ArtistRanking[],
    public artists: Artist[],
    public snapshot: Snapshot[]
  ) {}

  async fetchHistory(userId: string, artistId: string, timeRange?: TimeRange) {
    const userSnapshotIds = this.snapshot
      .filter((snanpshot) => snanpshot.userId === userId)
      .map((s) => {
        return s.id
      })

    const artistRankings = this.artistRankings.filter(
      (ar) =>
        userSnapshotIds.includes(ar.snapshotId) &&
        ar.artistId === artistId &&
        (!timeRange || ar.timeRange === timeRange)
    )

    const history = artistRankings.map((ar) => {
      const snanpshot = this.snapshot.find((s) => s.id === ar.snapshotId)!
      return {
        date: snanpshot.createdAt,
        position: ar.position,
        TimeRange: ar.timeRange,
      }
    })

    return history
  }

  async fetchDailyArtistsWithRankings(
    snapshotId: string,
    timeRange: TimeRange
  ) {
    const artist = this.artistRankings
      .filter((r) => r.snapshotId === snapshotId && r.timeRange === timeRange)
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
