import { ArtistCreateInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { ArtistReadRepository, ArtistsRepository } from '../artists-repository'

export class PrismaArtistsRepository
  implements ArtistsRepository, ArtistReadRepository
{
  async listTrackedByUser(userId: string) {
    const artists = await prisma.artist.findMany({
      where: {
        artistRankings: {
          some: {
            snapshot: {
              userId,
            },
          },
        },
      },
    })
    return artists
  }

  async findById(id: string) {
    const artist = await prisma.artist.findUnique({
      where: {
        id,
      },
    })

    return artist
  }
  async findManyByIds(ids: string[]) {
    const artists = await prisma.artist.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return artists
  }
  async upsertMany(data: ArtistCreateInput[]) {
    const operations = data.map((artist) =>
      prisma.artist.upsert({
        where: {
          id: artist.id,
        },
        update: {
          name: artist.name,
          imageUrl: artist.imageUrl,
          spotifyId: artist.spotifyId,
        },
        create: artist,
      })
    )

    return await prisma.$transaction(operations)
  }
}
