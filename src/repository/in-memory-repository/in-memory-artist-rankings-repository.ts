import { randomUUID } from 'node:crypto'
import { ArtistRanking } from '../../../generated/prisma/browser'
import { ArtistRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import {
  ArtistRankingsProps,
  ArtistRankingsRepository,
} from '../artist-rankings-repository'
import { BatchPayload } from '../../../generated/prisma/internal/prismaNamespace'
export class InMemoryArtistRankingRepository
  implements ArtistRankingsRepository
{
  public items: ArtistRanking[] = []

  async fetchManyArtistRankings(props: ArtistRankingsProps) {
    const ArtistRanking = this.items.filter(
      (item) =>
        props.artistId === item.artistId &&
        props.snapShotId === item.snapshotId &&
    )

    return ArtistRanking
  }
  async createMany(data: ArtistRankingUncheckedCreateInput[]) {
    const artistRankings = data.map((item) => ({
      id: item.id ? item.id : randomUUID(),
      artistId: item.artistId,
      position: item.position,
      snapshotId: item.snapshotId,
    }))
    this.items.push(...artistRankings)

    const batchPayload: { count: number } = {
      count: artistRankings.length,
    }

    return batchPayload as unknown as BatchPayload
  }
}
