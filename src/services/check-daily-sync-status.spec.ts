import { describe, it, expect, beforeEach } from 'vitest'
import { UsersRepository } from '../repository/user-repository'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { CheckDailySyncStatusUseCase } from './check-daily-sync-status'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'

let usersRepository: UsersRepository
let snapshotRepository: SnapShotsRepository
let sut: CheckDailySyncStatusUseCase // System Under Test

describe('Check Daily Sync Status Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    snapshotRepository = new InMemorySnapShotsRepository()
    sut = new CheckDailySyncStatusUseCase(snapshotRepository, usersRepository)
  })

  it('should be able to if not exist snapshot today for a user', async () => {
    const user = await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const { hasSnapshotToday, snapshotDate } = await sut.execute({
      userId: user.id,
    })

    expect(snapshotDate).toBe(undefined)
    expect(hasSnapshotToday).toBe(false)
  })

  it('should be able to if exist snapshot today for a user', async () => {
    const user = await usersRepository.create({
      id: 'user-01',
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })

    const snapshot = await snapshotRepository.create({
      date: new Date(),
      userId: user.id,
    })

    const { hasSnapshotToday, snapshotDate } = await sut.execute({
      userId: user.id,
    })

    expect(snapshotDate).toBe(snapshot.createdAt)
    expect(hasSnapshotToday).toBe(true)
  })

  it('should throw error if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
