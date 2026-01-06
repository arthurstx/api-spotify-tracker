import { Prisma, Track } from '../../generated/prisma/browser'

export interface TracksRepository {
  fetchManyByUserId(userId: string): Promise<Track[]>
  upsertMany(data: Prisma.TrackCreateInput[]): Promise<Track[]>
}

// with joins

interface FormatedTrack {
  id: string
  name: string
  imageUrl: string | null
  artistsName: string
}

export interface TrackReadRepository {
  findByTrackId(trackId: string): Promise<FormatedTrack | null>
  listTrackedByUser(userId: string): Promise<FormatedTrack[]>
}
