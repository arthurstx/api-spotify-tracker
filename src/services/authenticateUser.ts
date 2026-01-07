import { User } from '../../generated/prisma/browser'
import { SpotifyProvider } from '../provider/spotify-provider-types'
import { UsersRepository } from '../repository/user-repository'
import { AuthenticationError } from './errors/authentication-Error'
import { GetProfileError } from './errors/get-profile-error'

interface AuthenticateUserUseCaseRequest {
  code: string
  state: string
}

interface AuthenticateUserUseCaseResponse {
  user: User
}

export class authenticateUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private spotifyProvider: SpotifyProvider
  ) {}

  async execute({
    code,
    state,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const spotifyTokens = await this.spotifyProvider.getTokensByCode(
      code,
      state
    )

    if (!spotifyTokens) {
      throw new AuthenticationError()
    }

    const { accessToken, expires_in, refreshToken } = spotifyTokens

    const unformattedSpotifyPorfile = await this.spotifyProvider.getMe(
      accessToken
    )

    if (!unformattedSpotifyPorfile) {
      throw new GetProfileError()
    }

    const spotifyPorfile = {
      email: unformattedSpotifyPorfile.email,
      spotifyId: unformattedSpotifyPorfile.id,
      displayName: unformattedSpotifyPorfile.display_name,
      imageUrl: unformattedSpotifyPorfile?.images?.[0]?.url ?? null,
    }

    const { displayName, email, imageUrl, spotifyId } = spotifyPorfile

    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000)

    const userExists = await this.userRepository.findBySpotifyId(spotifyId)

    let user: User

    if (userExists) {
      userExists.accessToken = accessToken
      userExists.tokenExpiresAt = tokenExpiresAt
      userExists.refreshToken = refreshToken

      user = userExists

      user = await this.userRepository.update(user)
    } else {
      user = await this.userRepository.create({
        displayName,
        imageUrl,
        spotifyId,
        accessToken,
        tokenExpiresAt,
        refreshToken,
        email,
      })
    }

    return { user }
  }
}
