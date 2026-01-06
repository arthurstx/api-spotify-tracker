import { User } from '../../../generated/prisma/browser'
import { UserCreateInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { UsersRepository } from '../user-repository'

export class PrismaUserRepository implements UsersRepository {
  async findByUserId(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }
  async findBySpotifyId(spotifyId: string) {
    const user = await prisma.user.findUnique({
      where: {
        spotifyId,
      },
    })
    return user
  }
  async create(data: UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
  async update(data: User) {
    const user = await prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
    return user
  }
}
