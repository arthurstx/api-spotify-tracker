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
