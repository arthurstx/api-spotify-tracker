import { TrackCreateInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { TrackReadRepository, TracksRepository } from '../tracks-repository'

export class PrismaTracksRepository
  implements TracksRepository, TrackReadRepository
{
  async findByTrackId(id: string) {
    const unformattedTrack = await prisma.track.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        trackArtists: {
          select: {
            artist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!unformattedTrack) {
      return null
    }

    const track = {
      id: unformattedTrack.id,
      name: unformattedTrack.name,
      imageUrl: unformattedTrack.imageUrl,
      artistsName: unformattedTrack.trackArtists.map((ta) => ta.artist.name),
    }

    return track
  }

  async listTrackedByUser(userId: string) {
    const unformattedTrack = await prisma.track.findMany({
      where: {
        trackRankings: {
          some: {
            snapshot: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        trackArtists: {
          select: {
            artist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const tracks = unformattedTrack.map((track) => ({
      id: track.id,
      name: track.name,
      imageUrl: track.imageUrl,
      artistsName: track.trackArtists.map((ta) => ta.artist.name),
    }))

    return tracks
  }
  async upsertMany(data: TrackCreateInput[]) {
    const operations = data.map((track) =>
      prisma.track.upsert({
        where: {
          id: track.spotifyId,
        },
        update: {
          name: track.name,
          imageUrl: track.imageUrl,
          spotifyId: track.spotifyId,
        },
        create: track,
      })
    )

    return await prisma.$transaction(operations)
  }
}
