import { TrackArtist } from '../../generated/prisma/client'
import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'

export interface TrackArtistsIDs {
  artistId: string[]
  trackId: string
}

export interface TrackArtistsRepository {
  create(data: TrackArtistsIDs[]): Promise<TrackArtist[] | BatchPayload>
}
