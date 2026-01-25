import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { makePlayHistoryUseCase } from '../../../services/factories/make-history-ranking'
import { historyRankingQuerySchema } from './schema/history-ranking.schema'

export async function historyRanking(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.query as z.infer<typeof historyRankingQuerySchema>

  const playHistoryUseCase = makePlayHistoryUseCase()

  try {
    const { count } = await playHistoryUseCase.execute({
      userId: id,
    })
    reply.status(201).send({ count })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    } else {
      throw err
    }
  }
}