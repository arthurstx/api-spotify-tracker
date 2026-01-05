import { Snapshot } from '../../generated/prisma/browser'
import { SnapshotCreateManyInput } from '../../generated/prisma/models'

export interface SnapShotsRepository {
  fetchManyByUserIdAndPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Snapshot[]>
  findByUserAndDate(userId: string, date: Date): Promise<Snapshot | null>
  create(data: SnapshotCreateManyInput): Promise<Snapshot>
}
