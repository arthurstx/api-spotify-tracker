import { randomUUID } from 'node:crypto'
import { User } from '../../../generated/prisma/browser'
import { UserCreateInput } from '../../../generated/prisma/models'
import { UsersRepository } from '../user-repository'

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findBySpotifyId(id: string) {
    const user = this.items.find((item) => item.spotifyId === id)

    return user ? user : null
  }

  async create(data: UserCreateInput) {
    const user: User = {
      name: data.name ?? null,
      id: randomUUID(),
      spotifyId: data.spotifyId,
      email: data.email,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: new Date(data.expiresAt),
    }
    this.items.push(user)
    return user
  }
  async update(user: User) {
    const userIndex = this.items.findIndex((item) => item.id === user.id)

    if (userIndex >= 0) {
      this.items[userIndex] = user
    }

    return user
  }
}
