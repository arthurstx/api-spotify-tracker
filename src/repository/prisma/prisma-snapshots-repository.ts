import dayjs from 'dayjs'
import { SnapshotCreateManyInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { SnapShotsRepository } from '../snapshots-repository'

export class PrismaSnapshotRepository implements SnapShotsRepository {
  async fetchManyByUserId(userId: string) {
    const snapshots = await prisma.snapshot.findMany({
      where: {
        userId,
      },
    })
    return snapshots
  }
  async findLatest(userId: string) {
    const snapshot = await prisma.snapshot.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return snapshot
  }
  async fetchManySnapshotDatesByUserId(userId: string) {
    const snapshotDates = await prisma.snapshot.findMany({
      select: {
        createdAt: true,
      },
      where: {
        userId,
      },
    })

    return snapshotDates.map((s) => {
      return s.createdAt
    })
  }
  async fetchManyByUserIdAndPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    const snapshots = await prisma.snapshot.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })
    return snapshots
  }
  async findByUserAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date').toDate()
    const endOfTheDay = dayjs(date).endOf('date').toDate()
    const snapshot = await prisma.snapshot.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
    return snapshot
  }
  async create(data: SnapshotCreateManyInput) {
    const snapshot = await prisma.snapshot.create({
      data,
    })
    return snapshot
  }
}
