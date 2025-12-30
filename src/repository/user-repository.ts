import { Prisma, User } from '../../generated/prisma/browser'

export interface UsersRepository {
  findBySpotifyId(id: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  update(user: User): Promise<User>
}
