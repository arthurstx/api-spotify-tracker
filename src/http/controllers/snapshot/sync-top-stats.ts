import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { RefreshTokenExpiredError } from '../../../services/errors/refresh-token-expired-error'
import { AxiosError } from 'axios'
import { makeSyncTopStatsUseCase } from '../../../services/factories/make-sync-top-stats'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'

export async function syncTopStats(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateQuerySchema = z.object({
    id: z.uuid(),
  })

  const { id } = authenticateQuerySchema.parse(request.query)

  const refreshTokenUseCase = makeSyncTopStatsUseCase()

  try {
    const { count } = await refreshTokenUseCase.execute({
      userId: id,
    })
    reply.status(201).send({ count })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err })
    } else if (err instanceof RefreshTokenExpiredError) {
      return reply.status(402).send({ message: err })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    }
  }
}
