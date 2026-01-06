import { Prisma, Track } from '../../generated/prisma/browser'

export interface TracksRepository {
  fetchManyByUserId(userId: string): Promise<Track[]>
  upsertMany(data: Prisma.TrackCreateInput[]): Promise<Track[]>
}
