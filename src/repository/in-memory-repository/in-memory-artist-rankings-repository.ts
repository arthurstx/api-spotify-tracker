import { randomUUID } from 'node:crypto'
import { ArtistRanking } from '../../../generated/prisma/browser'
import { ArtistRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import {
  ArtistRankingsProps,
  ArtistRankingsRepository,
} from '../artist-rankings-repository'

export class InMemoryArtistRankingRepository
  implements ArtistRankingsRepository
{
  async fetchManyArtistRankings(props: ArtistRankingsProps) {
    const ArtistRanking = this.items.filter(
      (item) =>
        props.artistId === item.artistId &&
        props.snapShotId === item.snapshotId &&
        item.timeRange === props.timeRange
    )

    return ArtistRanking
  }
  public items: ArtistRanking[] = []
  async createMany(
    data: ArtistRankingUncheckedCreateInput[]
  ): Promise<ArtistRanking[]> {
    const artistRankings = data.map((item) => ({
      id: item.id ? item.id : randomUUID(),
      artistId: item.artistId,
      position: item.position,
      snapshotId: item.snapshotId,
      timeRange: item.timeRange,
    }))
    this.items.push(...artistRankings)
    return artistRankings
  }
}
