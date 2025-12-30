import { User } from '../../generated/prisma/browser'
import { SpotifyProvider } from '../provider/spotify-provider-repository'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenExpiredError } from './errors/refresh-token-expired-error'
import { UserNotFoundError } from './errors/user- not-found-erro'

interface RefreshTokenUseCaseRequest {
  userId: string
}

interface RefreshTokenUseCaseResponse {
  accessToken: string
  expiresAt: Date
}

export class RefreshTokenUseCase {
  constructor(
    private userRepository: UsersRepository,
    private spotifyProvider: SpotifyProvider
  ) {}

  async execute({
    userId,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    let user: User | null

    user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const { refreshToken } = user

    const spotifyTokens = await this.spotifyProvider.refreshAcessToken(
      refreshToken
    )

    if (!spotifyTokens) {
      throw new RefreshTokenExpiredError()
    }

    const { accessToken, expires_in, newRefreshToken } = spotifyTokens

    const expiresAt = new Date(Date.now() + expires_in * 1000)

    user.accessToken = accessToken
    user.expiresAt = expiresAt
    user.refreshToken = newRefreshToken ? newRefreshToken : user.refreshToken

    user = await this.userRepository.update(user)

    return { accessToken, expiresAt }
  }
}
