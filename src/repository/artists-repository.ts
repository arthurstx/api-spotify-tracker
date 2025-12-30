import { Artist, Prisma } from '../../generated/prisma/browser'

export interface ArtistsRepository {
  create(artist: Prisma.ArtistCreateInput): Promise<Artist>
  update(artist: Artist): Promise<Artist>
}
