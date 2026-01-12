import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { SpotifyProviderMock } from '../../provider/mock/SpotifyProviderMock'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { RefreshTokenUseCase } from '../refresh-token'

export function makeRefreshTokenUseCase() {
  try {
    const userRepository = new PrismaUserRepository()
    const spotifyProvider =
      process.env.NODE_ENV === 'test'
        ? new SpotifyProviderMock()
        : new SpotifyHttpProvider()
    const useCase = new RefreshTokenUseCase(userRepository, spotifyProvider)

    return useCase
  } catch (error) {
    console.error('Error creating RefreshTokenUseCase:', error)
    throw error // Re-throw the error after logging it
  }
}
