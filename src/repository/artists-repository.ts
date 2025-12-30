import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  findById(id: string): Promise<Artist | null>
  create(data: Prisma.ArtistCreateInput): Promise<Artist>
  //createMany(artists: Prisma.ArtistCreateInput[]): Promise<void>
  update(data: Prisma.ArtistUpdateInput): Promise<Artist>
}
