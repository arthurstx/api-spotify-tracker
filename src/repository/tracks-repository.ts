import { Prisma, Track } from '../../generated/prisma/browser'

export interface TracksRepository {
  upsertMany(data: Prisma.TrackCreateInput[]): Promise<Track[]>
}
