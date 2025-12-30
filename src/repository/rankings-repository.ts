import { Artist } from '../../generated/prisma/browser'

export interface RankingsRepository {
  createMany(artist: Artist[]): Promise<boolean>
}
