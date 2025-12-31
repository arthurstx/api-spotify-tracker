import { Snapshot } from '../../generated/prisma/browser'

export interface SnapShotsRepository {
  findByUserAndDate(userId: string, date: Date): Promise<Snapshot | null>
  create(userId: string, date: Date): Promise<Snapshot>
}
