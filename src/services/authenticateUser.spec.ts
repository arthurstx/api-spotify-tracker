import { describe, it, expect, beforeEach } from 'vitest'
import { SpotifyProviderMock } from '../provider/mock/SpotifyProviderMock'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { AuthenticationError } from './errors/authentication-Error'
import { GetProfileError } from './errors/get-profile-error'
import { AuthenticateUserUseCase } from './authenticateUser'

let userRepository: UsersRepository
let spotifyProvider: SpotifyProviderMock
let sut: AuthenticateUserUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    spotifyProvider = new SpotifyProviderMock()
    sut = new AuthenticateUserUseCase(userRepository, spotifyProvider)
  })

  it('should authenticate and create a new user', async () => {
    const user = await sut.execute({
      code: 'valid-code',
      state: 'valid-state',
    })

    expect(user.user).toBeDefined()
    expect(user.user.spotifyId).toBe('spotify_id')
    expect(user.user.email).toBe('jhondoe@example.com')
    expect(user.user.accessToken).toBe('acces_token')
  })

  it('should update user if already exists', async () => {
    const existingUser = await userRepository.create({
      displayName: 'jhon doe',
      spotifyId: 'spotify_id',
      email: 'old@email.com',
      accessToken: 'old_token',
      refreshToken: 'old_refresh',
      tokenExpiresAt: new Date(),
    })

    const user = await sut.execute({
      code: 'valid-code',
      state: 'valid-state',
    })

    expect(user.user.id).toEqual(existingUser.id)

    expect(user.user.accessToken).toBe('acces_token')
    expect(user.user.refreshToken).toBe('refresh_token')
  })

  it('should throw AuthenticationError if spotify does not return tokens', async () => {
    await expect(() =>
      sut.execute({ code: 'invalid-code', state: 'invalid-state' })
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('should throw GetProfileError if spotify profile is not returned', async () => {
    spotifyProvider.getMe = async () => null

    await expect(() =>
      sut.execute({ code: 'valid-code', state: 'valid-state' })
    ).rejects.toBeInstanceOf(GetProfileError)
  })
})
