import { prisma } from '../../lib/prisma'

import {
  TrackArtistsIDs,
  TrackArtistsRepository,
} from '../track-artists-repository'

export class PrismaTrackArtistsRepository implements TrackArtistsRepository {
  async create(data: TrackArtistsIDs[]) {
    const artistSpotifyIds = data.flatMap((item) => item.artistId)
    const trackSpotifyIds = data.map((item) => item.trackId)

    const artists = await prisma.artist.findMany({
      where: {
        spotifyId: { in: artistSpotifyIds },
      },
      select: {
        id: true,
        spotifyId: true,
      },
    })

    const artistMap = new Map(
      artists.map((artist) => [artist.spotifyId, artist.id])
    )

    const tracks = await prisma.track.findMany({
      where: {
        spotifyId: { in: trackSpotifyIds },
      },
      select: {
        id: true,
        spotifyId: true,
      },
    })

    const trackMap = new Map(tracks.map((track) => [track.spotifyId, track.id]))

    const normalizedData = data.flatMap((item) => {
      const trackDbId = trackMap.get(item.trackId)
      if (!trackDbId) return []

      return item.artistId
        .map((artistSpotifyId) => {
          const artistDbId = artistMap.get(artistSpotifyId)
          if (!artistDbId) return null

          return {
            trackId: trackDbId,
            artistId: artistDbId,
          }
        })
        .filter(
          (relation): relation is { trackId: string; artistId: string } =>
            relation !== null
        )
    })

    return prisma.trackArtist.createMany({
      data: normalizedData,
      skipDuplicates: true,
    })
  }
}
