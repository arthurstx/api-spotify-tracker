import { Snapshot } from '../../generated/prisma/browser'

export interface SnapShotsRepository {
  findByUserAndDate(id: string, date: Date): Promise<Snapshot>
  create(userId: string, date: Date): Promise<Snapshot>
}
