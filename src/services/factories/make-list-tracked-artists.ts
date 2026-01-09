import { PrismaArtistsRepository } from '../../repository/prisma/prisma-artists-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { ListTrackedArtistsUseCase } from '../list-tracked-artists'

export function makeListTrackedArtistUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistRepository = new PrismaArtistsRepository()
  const useCase = new ListTrackedArtistsUseCase(
    artistRepository,
    userRepository
  )

  return useCase
}
