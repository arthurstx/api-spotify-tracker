import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  upsertMany(data: Prisma.ArtistCreateInput[]): Promise<Artist[]>
}
