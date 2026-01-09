import { PrismaArtistsRankingsRepository } from '../../repository/prisma/prisma-artist-rankings-repository'
import { PrismaArtistsRepository } from '../../repository/prisma/prisma-artists-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetArtistHistoryUseCase } from '../get-artist-history'

export function makeGetArtistHistoryUseCase() {
  const userRepository = new PrismaUserRepository()
  const artistRepository = new PrismaArtistsRepository()
  const artistRankingRepository = new PrismaArtistsRankingsRepository()
  const useCase = new GetArtistHistoryUseCase(
    artistRepository,
    userRepository,
    artistRankingRepository
  )

  return useCase
}
