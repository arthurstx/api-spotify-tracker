import { Snapshot } from '../../generated/prisma/browser'

export interface SnapShotsRepository {
  fetchManyByUserIdAndPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Snapshot[]>
  findByUserAndDate(userId: string, date: Date): Promise<Snapshot | null>
  create(userId: string, date: Date): Promise<Snapshot>
}
