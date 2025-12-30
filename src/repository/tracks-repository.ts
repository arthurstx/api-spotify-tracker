import { Artist, Prisma } from '../../generated/prisma/browser'

export interface TracksRepository {
  upsertMany(data: Prisma.TrackCreateInput): Promise<Artist>
}
