import { ArtistRanking } from '../../../generated/prisma/browser'
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
  async fetchHistory(userId: string, artistId: string) {
    const unformattedHistory = await prisma.artistRanking.findMany({
      where: {
        artistId,
        snapshot: {
          userId,
        },
      },
      select: {
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
      }
    })

    return history
  }

  async fetchDailyArtistsWithRankings(
    snapshotId: string,
  ): Promise<FormatedArtists> {
    const unformattedArtistRanking = await prisma.artistRanking.findMany({
      where: {
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
  }: ArtistRankingsProps): Promise<ArtistRanking[]> {
    const artistRanking = await prisma.artistRanking.findMany({
      where: {
        artistId,
        snapshotId: snapShotId,
      },
    })
    return artistRanking
  }

  async createMany(data: ArtistRankingUncheckedCreateInput[]) {
    let count = 0
    data.map(async (d) => {
      const artist = await prisma.artist.findFirst({
        where: { spotifyId: d.artistId },
      })
      if (!artist) {
        return
      }
      await prisma.artistRanking.create({
        data: {
          ...d,
          artistId: artist.id,
        },
      })
      count++
    })
    return count
  }
}
