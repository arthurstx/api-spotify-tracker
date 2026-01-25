import { ArtistRanking, Prisma } from '../../generated/prisma/browser'

export interface ArtistRankingsProps {
  artistId: string
  snapShotId: string
}

export interface ArtistRankingsRepository {
  fetchManyArtistRankings(props: ArtistRankingsProps): Promise<ArtistRanking[]>
  createMany(
    data: Prisma.ArtistRankingUncheckedCreateInput[],
  ): Promise<ArtistRanking[] | number>
}

// with joins

export interface FormatedArtists {
  artist: Array<{
    id: string
    name: string
    imageUrl?: string | null
    position: number
  }>
}

interface history {
  date: Date
  position: number
}

export interface ArtistRankingsReadRepository {
  fetchHistory(userId: string, artistId: string): Promise<history[]>

  fetchDailyArtistsWithRankings(snapshotId: string): Promise<FormatedArtists>
}
