import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  findUniqueArtistById(id: string): Promise<Artist[]>
  upsertMany(data: Prisma.ArtistCreateInput[]): Promise<Artist[]>
}
