import { Artist } from '../../generated/prisma/browser'

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
