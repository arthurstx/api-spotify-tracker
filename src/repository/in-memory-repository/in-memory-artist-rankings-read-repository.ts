import {
  Artist,
  ArtistRanking,
  TimeRange,
} from '../../../generated/prisma/browser'
import { ArtistRankingsReadRepository } from '../artist-rankings-read-repository'

export class InMemoryArtistRankingsReadRepository
  implements ArtistRankingsReadRepository
{
  constructor(
    public artistRankings: ArtistRanking[],
    public artists: Artist[]
  ) {}

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
