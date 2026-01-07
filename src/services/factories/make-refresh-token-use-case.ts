import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { RefreshTokenUseCase } from '../refresh-token'

export function makeRefreshTokenUseCase() {
  const userRepository = new PrismaUserRepository()
  const spotifyProvider = new SpotifyHttpProvider()
  const useCase = new RefreshTokenUseCase(userRepository, spotifyProvider)

  return useCase
}
