import {
  Artist,
  ArtistRanking,
  Snapshot,
} from '../../../generated/prisma/browser'
import { ArtistReadRepository } from '../artists-repository'

export class InMemoryArtistReadRepository implements ArtistReadRepository {
  constructor(
    public snapshots: Snapshot[] = [],
    public artistRankings: ArtistRanking[] = [],
    public artists: Artist[] = []
  ) {}

  async listTrackedByUser(userId: string): Promise<Artist[]> {
    const userSnapshots = this.snapshots.filter((s) => s.userId === userId)
    const snapshotIds = userSnapshots.map((s) => s.id)

    const relevantRankings = this.artistRankings.filter((ar) =>
      snapshotIds.includes(ar.snapshotId)
    )

    const uniqueArtistIds = [
      ...new Set(relevantRankings.map((ar) => ar.artistId)),
    ]

    return this.artists.filter((artist) => uniqueArtistIds.includes(artist.id))
  }
}
