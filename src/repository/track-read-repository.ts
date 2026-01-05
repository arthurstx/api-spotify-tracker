interface FormatedTrack {
  id: string
  name: string
  imageUrl?: string | null
  artistsName: string
}

export interface TrackReadRepository {
  listTrackedByUser(userId: string): Promise<FormatedTrack[]>
}
