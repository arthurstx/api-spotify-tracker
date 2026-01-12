import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { SpotifyProviderMock } from '../../provider/mock/SpotifyProviderMock'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { AuthenticateUserUseCase } from '../../services/authenticateUser'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepository()

  const spotifyProvider =
    process.env.NODE_ENV === 'test'
      ? new SpotifyProviderMock()
      : new SpotifyHttpProvider()

  return new AuthenticateUserUseCase(userRepository, spotifyProvider)
}
