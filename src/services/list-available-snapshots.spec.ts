import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import type { UsersRepository } from '../repository/user-repository'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { InMemorySnapShotsRepository } from '../repository/in-memory-repository/in-memory-snapshots-repository'
import { ListAvailableSnapshotsUseCase } from './list-available-snapshots'
import { InMemoryUserRepository } from '../repository/in-memory-repository/in-memory-user-repository'

let userRepository: UsersRepository
let snapShotsRepository: SnapShotsRepository
let sut: ListAvailableSnapshotsUseCase

describe('sync top stats use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    snapShotsRepository = new InMemorySnapShotsRepository()
    sut = new ListAvailableSnapshotsUseCase(snapShotsRepository)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able return snapshot dates for a given user', async () => {
    const userId = 'user-01'

    await userRepository.create({
      id: userId,
      spotifyId: 'spotify_id',
      email: 'jhondoe@email.com',
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      displayName: 'jhon doe',
      tokenExpiresAt: new Date(),
    })
    vi.setSystemTime(new Date(2025, 0, 2, 8))
    snapShotsRepository.create({ userId, date: new Date() })
    vi.setSystemTime(new Date(2025, 0, 3, 8))
    snapShotsRepository.create({ userId, date: new Date() })
    vi.setSystemTime(new Date(2025, 0, 4, 8))
    snapShotsRepository.create({ userId, date: new Date() })

    const { snapshotDate } = await sut.execute({ userId })

    expect(snapshotDate).toHaveLength(3)
    expect(snapshotDate[0]).toEqual(new Date(2025, 0, 2, 8))
  })
})
