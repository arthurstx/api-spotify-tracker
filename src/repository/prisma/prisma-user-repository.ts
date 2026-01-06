import { User } from '../../../generated/prisma/browser'
import { UserCreateInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { UsersRepository } from '../user-repository'

export class PrismaUserRepository implements UsersRepository {
  async findByUserId(id: string) {
    const user = prisma.user.findFirst({
      where: {
        id,
      },
    })
    return user
  }
  async findBySpotifyId(spotifyId: string) {
    const user = prisma.user.findFirst({
      where: {
        spotifyId,
      },
    })
    return user
  }
  async create(data: UserCreateInput) {
    const user = prisma.user.create({
      data,
    })
    return user
  }
  async update(data: User) {
    const user = prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
    return user
  }
}
