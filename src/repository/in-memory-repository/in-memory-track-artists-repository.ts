import {
  TrackArtistsIDs,
  TrackArtistsRepository,
} from '../track-artists-repository'

export class InMemoryTrackArtistsRepository
  implements TrackArtistsRepository
{
  public items: { trackId: string; artistId: string }[] = []

  async create(data: TrackArtistsIDs[]) {
    const normalizedData = data.flatMap((item) =>
      item.artistId.map((artistId) => ({
        trackId: item.trackId,
        artistId,
      }))
    )

    this.items.push(...normalizedData)

    return {
      count: normalizedData.length,
    }
  }
}
