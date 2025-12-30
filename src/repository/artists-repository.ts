import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  findById(id: string): Promise<Artist | null>
  upsertMany(data: Prisma.ArtistCreateInput): Promise<Artist>
  update(data: Prisma.ArtistUpdateInput): Promise<Artist>
}
