import { describe, it, expect, beforeEach } from 'vitest'
import { SpotifyProviderMock } from '../provider/mock/SpotifyProviderMock'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { RefreshTokenUseCase } from './refresh-token'
import { UserNotFoundError } from './errors/user- not-found-erro'
import { RefreshTokenExpiredError } from './errors/refresh-token-expired-error'

let userRepository: UsersRepository
let spotifyProvider: SpotifyProviderMock
let sut: RefreshTokenUseCase

describe('Refresh token use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    spotifyProvider = new SpotifyProviderMock()
    sut = new RefreshTokenUseCase(userRepository, spotifyProvider)
  })

  it('should be able to refresh token with new refresh token', async () => {
    const userId = 'user-01'

    const user = await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    await sut.execute({ userId })

    const response = await spotifyProvider.refreshAcessToken(userId)

    if (!response) {
      return null
    }

    const { accessToken } = response

    expect(user.accessToken).toEqual(accessToken)
  })

  it('should be able to refresh token whitout a new refresh token', async () => {
    const userId = 'user-01'

    const user = await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    spotifyProvider.refreshAcessToken = async (_refreshToken: string) => {
      return {
        accessToken: 'new-access-token',
        expires_in: 3600,
        newRefreshToken: null,
      }
    }

    await sut.execute({ userId })

    const response = await spotifyProvider.refreshAcessToken(userId)

    if (!response) {
      return null
    }

    const { accessToken } = response

    expect(user.accessToken).toEqual(accessToken)
  })
  it('should not be able to fetch user', async () => {
    await userRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'old_refresh',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    await expect(sut.execute({ userId: 'invalid-id' })).rejects.toBeInstanceOf(
      UserNotFoundError
    )
  })

  it('should not be able to get refresh token', async () => {
    const userId = 'user-01'

    await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'invalid-token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    spotifyProvider.refreshAcessToken = async () => null

    await expect(sut.execute({ userId })).rejects.toBeInstanceOf(
      RefreshTokenExpiredError
    )
  })
})
