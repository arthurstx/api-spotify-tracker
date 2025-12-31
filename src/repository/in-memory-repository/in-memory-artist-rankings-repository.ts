import { randomUUID } from 'node:crypto'
import { ArtistRanking } from '../../../generated/prisma/browser'
import { ArtistRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import { ArtistRankingsRepository } from '../artist-rankings-repository'

export class InMemoryArtistRankingRepository
  implements ArtistRankingsRepository
{
  public items: ArtistRanking[] = []
  async createMany(
    data: ArtistRankingUncheckedCreateInput[]
  ): Promise<ArtistRanking[]> {
    const artistRankings = data.map((item) => ({
      id: randomUUID() ?? item.id,
      artistId: item.artistId,
      position: item.position,
      snapshotId: item.snapshotId,
      timeRange: item.timeRange,
    }))
    this.items.push(...artistRankings)
    return artistRankings
  }
}
