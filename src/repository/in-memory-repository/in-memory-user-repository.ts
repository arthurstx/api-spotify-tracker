import { randomUUID } from 'node:crypto'
import { User } from '../../../generated/prisma/browser'
import { UserCreateInput } from '../../../generated/prisma/models'
import { UsersRepository } from '../user-repository'

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findByUserId(id: string) {
    const user = this.items.find((item) => item.id === id)

    return user ? user : null
  }

  async findBySpotifyId(id: string) {
    const user = this.items.find((item) => item.spotifyId === id)

    return user ? user : null
  }

  async create(data: UserCreateInput) {
    const user: User = {
      displayName: data.displayName ?? null,
      id: data.id ? data.id : randomUUID(),
      spotifyId: data.spotifyId,
      email: data.email ?? null,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenExpiresAt: new Date(data.tokenExpiresAt),
      createdAt: new Date(),
      imageUrl: data.imageUrl ?? null,
      updatedAt: new Date(),
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
