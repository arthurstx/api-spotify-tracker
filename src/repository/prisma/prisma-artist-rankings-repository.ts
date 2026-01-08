import { ArtistRanking, TimeRange } from '../../../generated/prisma/browser'
import { ArtistRankingUncheckedCreateInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import {
  ArtistRankingsProps,
  ArtistRankingsReadRepository,
  ArtistRankingsRepository,
  FormatedArtists,
} from '../artist-rankings-repository'

export class PrismaArtistsRankingsRepository
  implements ArtistRankingsRepository, ArtistRankingsReadRepository
{
  async fetchHistory(userId: string, artistId: string, timeRange?: TimeRange) {
    const unformattedHistory = await prisma.artistRanking.findMany({
      where: {
        artistId,
        timeRange,
        snapshot: {
          userId,
        },
      },
      select: {
        position: true,
        timeRange: true,
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
        timeRange: uh.timeRange ?? undefined,
      }
    })

    return history
  }

  async fetchDailyArtistsWithRankings(
    snapshotId: string,
    timeRange: TimeRange
  ): Promise<FormatedArtists> {
    const unformattedArtistRanking = await prisma.artistRanking.findMany({
      where: {
        timeRange,
        snapshotId,
      },
      select: {
        position: true,
        artist: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    })

    const artist = unformattedArtistRanking.map((ua) => {
      return {
        id: ua.artist.id,
        name: ua.artist.name,
        imageUrl: ua.artist.imageUrl ?? null,
        position: ua.position,
      }
    })

    return { artist }
  }
  async fetchManyArtistRankings({
    artistId,
    snapShotId,
    timeRange,
  }: ArtistRankingsProps): Promise<ArtistRanking[]> {
    const artistRanking = await prisma.artistRanking.findMany({
      where: {
        artistId,
        timeRange,
        snapshotId: snapShotId,
      },
    })
    return artistRanking
  }

  async createMany(data: ArtistRankingUncheckedCreateInput[]) {
    const count = await prisma.artistRanking.createMany({
      data,
    })
    return count
  }
}
