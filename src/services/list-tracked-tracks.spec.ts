import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { ListTrackedTracksUseCase } from './list-tracked-tracks'
import { InMemoryTrackReadRepository } from '../repository/in-memory-repository/in-memory-track-read-repository'
import { User } from '../../generated/prisma/browser'
import { UserNotFoundError } from './errors/user-not-found-error'

let usersRepository: InMemoryUserRepository
let trackReadRepository: InMemoryTrackReadRepository
let sut: ListTrackedTracksUseCase

let user: User

// TODO: fix me
describe('List Tracked Tracks Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    trackReadRepository = new InMemoryTrackReadRepository()
    sut = new ListTrackedTracksUseCase(trackReadRepository, usersRepository)

    user = await usersRepository.create({
      displayName: 'John Doe',
      email: 'johndoe@example.com',
      spotifyId: '1',
      accessToken: '1',
      refreshToken: '1',
      tokenExpiresAt: new Date(),
    })
  })

  it('should be able to list tracked tracks', async () => {
    const artist = {
      id: '1',
      name: 'Artist 1',
      imageUrl: 'http://example.com/image.jpg',
      spotifyId: '1',
      createdAt: new Date(),
    }
    trackReadRepository.artists.push(artist)

    const track = {
      id: '1',
      name: 'Track 1',
      imageUrl: 'http://example.com/image.jpg',
      spotifyId: '1',
      durationMs: 1000,
      createdAt: new Date(),
    }
    trackReadRepository.tracks.push(track)

    const trackArtist = {
      trackId: '1',
      artistId: '1',
    }
    trackReadRepository.trackArtists.push(trackArtist)

    const snapshot = {
      id: '1',
      userId: user.id,
      date: new Date(),
      createdAt: new Date(),
    }
    trackReadRepository.snapshots.push(snapshot)

    const trackRanking = {
      id: '1',
      snapshotId: '1',
      trackId: '1',
      position: 1,
      timeRange: 'SHORT_TERM' as const,
    }
    trackReadRepository.trackRankings.push(trackRanking)

    const { tracks } = await sut.execute({
      userId: user.id,
    })

    expect(tracks).toHaveLength(1)
    expect(tracks[0]).toEqual(
      expect.objectContaining({
        name: 'Track 1',
        artistsName: ['Artist 1'],
      })
    )
  })

  it('should throw an error if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existing-user-id',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
