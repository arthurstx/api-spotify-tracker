import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  fetchManyByUserId(userId: string): Promise<Artist[]>
  findById(id: string): Promise<Artist | null>
  findManyByIds(ids: string[]): Promise<Artist[]>
  upsertMany(data: Prisma.ArtistCreateInput[]): Promise<Artist[]>
}
