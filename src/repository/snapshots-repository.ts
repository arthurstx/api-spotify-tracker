import { Prisma, Snapshot } from '../../generated/prisma/browser'

export interface SnapShotsRepository {
  findByUserAndDate(id: string, date: Date): Promise<Snapshot>
  create(data: Prisma.SnapshotCreateInput): Promise<Snapshot>
}
