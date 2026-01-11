import { describe, it, expect, beforeEach } from 'vitest'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { TimeRange } from '../../generated/prisma/enums'
import { GetArtistHistoryUseCase } from './get-artist-history'
import { ArtistsRepository } from '../repository/artists-repository'
import { InMemoryArtistRankingsReadRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-read-repository'
import { InMemoryArtistsRepository } from '../repository/in-memory-repository/in-memory-artists-repository'
import { ArtistNotFoundError } from './errors/artist-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

let usersRepository: UsersRepository
let artistRepository: ArtistsRepository
let artistRankingsRead: InMemoryArtistRankingsReadRepository
let sut: GetArtistHistoryUseCase // System Under Test

describe('Get Artist History Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    artistRepository = new InMemoryArtistsRepository()
    artistRankingsRead = new InMemoryArtistRankingsReadRepository([], [], [])
    sut = new GetArtistHistoryUseCase(
      artistRepository,
      usersRepository,
      artistRankingsRead
    )
  })

  it('should be able to get track history for a user', async () => {
    await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const artist = await artistRepository.upsertMany([
      {
        id: 'artist-01',
        name: 'jhon doe',
        spotifyId: 'spotify_id',
        imageUrl: 'http://img.com',
      },
    ])

    artistRankingsRead.artists.push(artist[0])

    const snapshotId = 'snap-1'
    artistRankingsRead.snapshot.push({
      id: snapshotId,
      userId: 'user-01',
      date: new Date('2023-10-01'),
      createdAt: new Date(),
    })

    artistRankingsRead.artistRankings.push({
      id: 'rank-1',
      artistId: 'artist-01',
      snapshotId: snapshotId,
      position: 1,
      timeRange: TimeRange.SHORT_TERM,
    })

    const result = await sut.execute({
      userId: 'user-01',
      artistId: 'artist-01',
      timeRange: TimeRange.SHORT_TERM,
    })

    // 3. Asserções
    expect(result.artist.name).toBe('jhon doe')
    expect(result.artist.id).toBe('artist-01')
    expect(result.history).toHaveLength(1)
    expect(result.history).toEqual([
      expect.objectContaining({
        position: 1,
        TimeRange: 'SHORT_TERM',
      }),
    ])
  })

  it('should throw error if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent',
        artistId: 'track-1',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw error if artist does not exist', async () => {
    await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        artistId: 'non-existent',
      })
    ).rejects.toBeInstanceOf(ArtistNotFoundError)
  })
})
