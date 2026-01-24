import { SpotifyHttpProvider } from '../../http/providers/spotify-provider/spotify-http-provider'
import { SpotifyProviderMock } from '../../provider/mock/SpotifyProviderMock'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetTopItemsUseCase } from '../get-top-items'

export function makeGetTopItemsUseCase() {
  const userRepository = new PrismaUserRepository()
  const spotifyProvider =
    process.env.NODE_ENV === 'test'
      ? new SpotifyProviderMock()
      : new SpotifyHttpProvider()
  const useCase = new GetTopItemsUseCase(userRepository, spotifyProvider)

  return useCase
}
