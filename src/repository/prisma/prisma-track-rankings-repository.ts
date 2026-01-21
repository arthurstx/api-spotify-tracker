import { TimeRange, TrackRanking } from '../../../generated/prisma/browser'
import { TrackRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import {
  FormatedTracks,
  TrackRankingReadRepository,
  TrackRankingsProps,
  TrackRankingsRepository,
} from '../track-rankings-repository'

export class PrismaTrackRankingsRepository
  implements TrackRankingsRepository, TrackRankingReadRepository
{
  async fetchManyTrackRankings({
    snapShotId,
    timeRange,
    trackId,
  }: TrackRankingsProps): Promise<TrackRanking[] | []> {
    const trackRanking = prisma.trackRanking.findMany({
      where: {
        trackId,
        timeRange,
        snapshot: {
          id: snapShotId,
        },
      },
    })

    return trackRanking
  }

  async createMany(data: TrackRankingUncheckedCreateInput[]) {
    let count = 0
    data.map(async (d) => {
      const track = await prisma.track.findFirst({
        where: { spotifyId: d.trackId },
      })
      if (!track) {
        return
      }
      await prisma.trackRanking.create({
        data: {
          ...d,
          trackId: track.id,
        },
      })
      count++
    })
    return { count }
  }
  async fetchDailyTracksWithRankings(
    snapshotId: string,
    timeRange: TimeRange,
  ): Promise<FormatedTracks> {
    const unformattedTrackRanking = await prisma.trackRanking.findMany({
      where: {
        timeRange,
        snapshot: {
          id: snapshotId,
        },
      },
      select: {
        position: true,
        track: {
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
        },
      },
    })

    const track = unformattedTrackRanking.map((ut) => {
      return {
        id: ut.track.id,
        name: ut.track.name,
        imageUrl: ut.track.imageUrl ?? null,
        position: ut.position,
        artistName: ut.track.trackArtists.map((ta) => ta.artist.name),
      }
    })

    return { track }
  }

  async fetchHistory(userId: string, trackId: string, timeRange?: TimeRange) {
    const unformattedHistory = await prisma.trackRanking.findMany({
      where: {
        trackId,
        timeRange,
        snapshot: {
          userId,
        },
      },
      select: {
        timeRange: true,
        position: true,
        snapshot: {
          select: {
            createdAt: true,
          },
        },
      },
    })

    const history = unformattedHistory.map((uh) => {
      return {
        date: uh.snapshot.createdAt,
        position: uh.position,
        timeRange: uh.timeRange,
      }
    })

    return history
  }
}
