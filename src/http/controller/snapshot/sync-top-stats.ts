import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { RefreshTokenExpiredError } from '../../../services/errors/refresh-token-expired-error'
import { AxiosError } from 'axios'
import { makeSyncTopStatsUseCase } from '../../../services/factories/make-sync-top-stats'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { syncTopStatsQuerySchema } from './schema/sync-top-stats.schema'

export async function syncTopStats(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.query as z.infer<typeof syncTopStatsQuerySchema>

  const refreshTokenUseCase = makeSyncTopStatsUseCase()

  try {
    const { count } = await refreshTokenUseCase.execute({
      userId: id,
    })
    reply.status(201).send({ count })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof RefreshTokenExpiredError) {
      return reply.status(402).send({ message: err.message })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    } else {
      throw err
    }
  }
}