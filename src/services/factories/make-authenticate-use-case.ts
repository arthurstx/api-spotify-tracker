import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { authenticateUserUseCase } from '../authenticateUser'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepository()
  const spotifyProvider = new SpotifyHttpProvider()
  const authenticateUseCase = new authenticateUserUseCase(
    userRepository,
    spotifyProvider
  )

  return authenticateUseCase
}
