import { User } from '../../generated/prisma/browser'
import { SpotifyProvider } from '../provider/spotify-provider-types'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenExpiredError } from './errors/refresh-token-expired-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface RefreshTokenUseCaseRequest {
  userId: string
}

interface RefreshTokenUseCaseResponse {
  accessToken: string
  tokenExpiresAt: Date
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

    const { expires_in, refresh_token, access_token } = spotifyTokens

    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000)

    user.accessToken = access_token
    user.tokenExpiresAt = tokenExpiresAt
    user.refreshToken = refresh_token ? refresh_token : user.refreshToken

    user = await this.userRepository.update(user)

    return { accessToken: access_token, tokenExpiresAt }
  }
}
