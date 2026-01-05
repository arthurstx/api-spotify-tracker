import { beforeEach, describe, expect, it } from 'vitest'
import { ListTrackedArtistsUseCase } from './list-tracked-artists'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { InMemoryArtistReadRepository } from '../repository/in-memory-repository/in-memory-artist-read-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { randomUUID } from 'crypto'
import { Artist } from '../../generated/prisma/browser'

describe('List Tracked Artists Use Case', () => {
  let userRepository: InMemoryUserRepository
  let artistReadRepository: InMemoryArtistReadRepository
  let sut: ListTrackedArtistsUseCase

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    // Inicializamos o repositório in-memory vazio
    artistReadRepository = new InMemoryArtistReadRepository([], [], [])

    sut = new ListTrackedArtistsUseCase(artistReadRepository, userRepository)
  })

  it('should not be able to list artists if the user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should be able to list tracked artists by user', async () => {
    // 1. Criar usuário no repositório
    const user = await userRepository.create({
      id: 'user-01',
      spotifyId: 'spotify-01',
      displayName: 'John Doe',
      accessToken: 'token',
      refreshToken: 'refresh',
      tokenExpiresAt: new Date(),
    })
    const snapshotId = randomUUID()
    const artistId = 'artist-01'

    // Mockando um artista
    const artist: Artist = {
      id: artistId,
      spotifyId: 'spotifyId-01',
      name: 'Os Mutantes',
      imageUrl: 'http://image.png',
      createdAt: new Date(),
    }

    artistReadRepository.artists.push(artist)
    artistReadRepository.snapshots.push({
      id: snapshotId,
      userId: user.id,
      date: new Date(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    artistReadRepository.artistRankings.push({
      id: randomUUID(),
      snapshotId: snapshotId,
      artistId: artistId,
      position: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    // 3. Executar o caso de uso
    const { artists } = await sut.execute({
      userId: user.id,
    })

    // 4. Asserções
    expect(artists).toHaveLength(1)
    expect(artists[0]).toEqual(
      expect.objectContaining({
        id: artistId,
        name: 'Os Mutantes',
        imageUrl: 'http://image.png',
      })
    )
  })

  it('should return an empty list if user has no tracked artists', async () => {
    const user = await userRepository.create({
      id: 'user-02',
      spotifyId: 'spotify-02',
      displayName: 'Jane Doe',
      accessToken: 'token',
      refreshToken: 'refresh',
      tokenExpiresAt: new Date(),
    })

    const { artists } = await sut.execute({
      userId: user.id,
    })

    expect(artists).toHaveLength(0)
  })
})
