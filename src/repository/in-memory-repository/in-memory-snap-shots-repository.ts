import dayjs from 'dayjs'
import { Snapshot } from '../../../generated/prisma/browser'
import { SnapShotsRepository } from '../snapshots-repository'
import { randomUUID } from 'node:crypto'

export class InMemorySnapShotsRepository implements SnapShotsRepository {
  public items: Snapshot[] = []
  async findByUserAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const snapShotOnSameDate = this.items.find((item) => {
      const snapShotDate = dayjs(item.createdAt)
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
  async create(userId: string, date: Date) {
    const snapShots = {
      id: randomUUID() ?? null,
      createdAt: new Date(),
      date: date,
      userId: userId,
    } as Snapshot

    this.items.push(snapShots)
    return snapShots
  }
}
