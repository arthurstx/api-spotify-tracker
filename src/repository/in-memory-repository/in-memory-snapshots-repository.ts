import dayjs from 'dayjs'
import { Snapshot } from '../../../generated/prisma/browser'
import { SnapShotsRepository } from '../snapshots-repository'
import { randomUUID } from 'node:crypto'

export class InMemorySnapShotsRepository implements SnapShotsRepository {
  public items: Snapshot[] = []

  async findLatest(userId: string): Promise<Snapshot | null> {
    const snapShot = this.items.find((s) => s.userId === userId)
    if (!snapShot) {
      return null
    }
    return snapShot
  }

  async fetchManySnapshotDatesByUserId(userId: string) {
    return this.items
      .filter((item) => item.userId === userId)
      .map((snapshot) => snapshot.createdAt)
  }

  async fetchManyByUserIdAndPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    const snapShot = this.items.filter(
      (item) =>
        item.userId === userId && startDate <= item.date && endDate >= item.date
    )

    return snapShot
  }
  async findByUserAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const snapShotOnSameDate = this.items.find((item) => {
      const snapShotDate = dayjs(item.date)
      const isOnSameDate =
        snapShotDate.isAfter(startOfTheDay) &&
        snapShotDate.isBefore(endOfTheDay)

      return item.userId === userId && isOnSameDate
    })

    if (!snapShotOnSameDate) {
      return null
    }
    return snapShotOnSameDate
  }
  async create(data: { userId: string; date: Date; id?: string }) {
    const snapShots = {
      id: data.id ?? randomUUID(),
      createdAt: new Date(),
      date: data.date,
      userId: data.userId,
    } as Snapshot

    this.items.push(snapShots)
    return snapShots
  }
}
