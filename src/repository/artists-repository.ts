import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  findById(id: string): Promise<Artist | null>
  findManyByIds(ids: string[]): Promise<Artist[]>
  upsertMany(data: Prisma.ArtistCreateInput[]): Promise<Artist[]>
}

// with joins

export interface FormatedArtists {
  artist: Array<{
    id: string
    name: string
    imageUrl?: string | null
  }>
}

export interface ArtistReadRepository {
  listTrackedByUser(userId: string): Promise<Artist[]>
}
