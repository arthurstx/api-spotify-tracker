import { describe, it, expect, beforeEach } from 'vitest'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { TimeRange } from '../../generated/prisma/enums'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { GetLatestTopTracksUseCase } from './get-latest-top-tracks'
import { InMemoryTrackRankingReadRepository } from '../repository/in-memory-repository/in-memory-track-ranking-read-repository'
import { Track } from '../../generated/prisma/browser'
import { SnapshotNotFoundError } from './errors/snapshot-not-found-error'

let usersRepository: UsersRepository
let trackRankingsRead: InMemoryTrackRankingReadRepository
let snapshotRepository: SnapShotsRepository
let sut: GetLatestTopTracksUseCase

describe('Get latest top tracks Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    snapshotRepository = new InMemorySnapShotsRepository()
    trackRankingsRead = new InMemoryTrackRankingReadRepository()
    sut = new GetLatestTopTracksUseCase(
      snapshotRepository,
      usersRepository,
      trackRankingsRead
    )
  })

  it('should be able to get latest track ranking', async () => {
    await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const track: Track = {
      id: 'track-01',
      name: 'track name',
      spotifyId: 'spotify_id',
      durationMs: 300,
      imageUrl: 'http://img.com',
      createdAt: new Date(),
    }

    trackRankingsRead.tracks.push(track)

    const snapshot = await snapshotRepository.create({
      date: new Date(),
      id: 'snap-1',
      userId: 'user-01',
    })

    trackRankingsRead.snapshots.push(snapshot)

    trackRankingsRead.rankings.push({
      id: 'rank-1',
      trackId: 'track-01',
      snapshotId: snapshot.id,
      position: 1,
      timeRange: TimeRange.SHORT_TERM,
    })

    const result = await sut.execute({
      userId: 'user-01',
      timeRange: TimeRange.SHORT_TERM,
    })

    expect(result.track[0].name).toBe('track name')
    expect(result.track[0].id).toBe('track-01')
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

  it('should throw error if snapshot does not exist', async () => {
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
        timeRange: TimeRange.LONG_TERM,
      })
    ).rejects.toBeInstanceOf(SnapshotNotFoundError)
  })
})
