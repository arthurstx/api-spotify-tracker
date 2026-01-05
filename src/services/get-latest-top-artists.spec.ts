import { describe, it, expect, beforeEach } from 'vitest'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { TimeRange } from '../../generated/prisma/enums'
import { InMemoryArtistRankingsReadRepository } from '../repository/in-memory-repository/in-memory-artist-rankings-read-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { GetLatestTopArtistsseCase } from './get-latest-top-artists'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { Artist } from '../../generated/prisma/browser'

let usersRepository: UsersRepository
let artistRankingsRead: InMemoryArtistRankingsReadRepository
let snapshotRepository: SnapShotsRepository
let sut: GetLatestTopArtistsseCase

describe('Get latest top artist Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    snapshotRepository = new InMemorySnapShotsRepository()
    artistRankingsRead = new InMemoryArtistRankingsReadRepository([], [], [])
    sut = new GetLatestTopArtistsseCase(
      snapshotRepository,
      usersRepository,
      artistRankingsRead
    )
  })

  it('should be able to get latest artist ranking', async () => {
    await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const artist: Artist = {
      id: 'artist-01',
      name: 'jhon doe',
      spotifyId: 'spotify_id',
      imageUrl: 'http://img.com',
      createdAt: new Date(),
    }

    artistRankingsRead.artists.push(artist)

    const snapshot = await snapshotRepository.create({
      id: 'snap-1',
      userId: 'user-01',
      date: new Date(),
    })

    artistRankingsRead.snapshot.push(snapshot)

    artistRankingsRead.artistRankings.push({
      id: 'rank-1',
      artistId: 'artist-01',
      snapshotId: snapshot.id,
      position: 1,
      timeRange: TimeRange.SHORT_TERM,
    })

    const result = await sut.execute({
      userId: 'user-01',
      timeRange: TimeRange.SHORT_TERM,
    })

    console.log(result.artist)

    // 3. Asserções
    expect(result.artist[0].name).toBe('jhon doe')
    expect(result.artist[0].id).toBe('artist-01')
    expect(result.snapshotDate).toBe(snapshot.createdAt)
  })

  it('should throw error if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent',
        timeRange: TimeRange.LONG_TERM,
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
