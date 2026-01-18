import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'

export interface PlayHistoryRepository {
  createMany(
    userId: string,
    array: { trackId: string; playedAt: Date }[]
  ): Promise<BatchPayload>
}
