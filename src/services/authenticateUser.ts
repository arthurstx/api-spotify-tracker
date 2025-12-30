import { User } from '../../generated/prisma/browser'
import { SpotifyProvider } from '../provider/spotify-provider-repository'
import { UsersRepository } from '../repository/user-repository'
import { AuthenticationError } from './errors/authentication-Error'
import { GetProfileError } from './errors/get-profile-error'

interface AuthenticateUserUseCaseRequest {
  code: string
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
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const spotifyTokens = await this.spotifyProvider.getTokensByCode(code)

    if (!spotifyTokens) {
      throw new AuthenticationError()
    }

    const { accessToken, expires_in, refreshToken } = spotifyTokens

    const spotifyPorfile = await this.spotifyProvider.getMe(accessToken)

    if (!spotifyPorfile) {
      throw new GetProfileError()
    }

    const { spotifyId, email } = spotifyPorfile

    const expiresAt = new Date(Date.now() + expires_in * 1000)

    const userExists = await this.userRepository.findBySpotifyId(spotifyId)

    let user: User

    if (userExists) {
      userExists.accessToken = accessToken
      userExists.expiresAt = expiresAt
      userExists.refreshToken = refreshToken

      user = userExists

      user = await this.userRepository.update(user)
    } else {
      user = await this.userRepository.create({
        spotifyId,
        accessToken,
        expiresAt,
        refreshToken,
        email,
      })
    }

    return { user }
  }
}
