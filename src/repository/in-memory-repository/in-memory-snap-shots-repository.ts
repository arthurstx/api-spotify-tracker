import dayjs from 'dayjs'
import { Snapshot } from '../../../generated/prisma/browser'
import { SnapShotsRepository } from '../snapshots-repository'
import { randomUUID } from 'node:crypto'

export class InMemorySnapShotsRepository implements SnapShotsRepository {
  public items: Snapshot[] = []
  async findByUserAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('day')
    const endfOfTheDay = dayjs(date).endOf('day')

    const snapShots = this.items.find((item) => {
      const snapShotsInDate = dayjs(item.createdAt)
      const snapShotsInSameDay =
        snapShotsInDate.isAfter(startOfTheDay) &&
        snapShotsInDate.isBefore(endfOfTheDay)

      return item.id === userId && snapShotsInSameDay
    })

    if (!snapShots) {
      return null
    }

    return snapShots
  }
  async create(userId: string, date: Date) {
    const snapShots = {
      id: randomUUID() ?? null,
      createdAt: new Date(),
      date: date,
      userId: userId,
    } as Snapshot

    return snapShots
  }
}
