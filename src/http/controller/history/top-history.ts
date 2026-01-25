import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { makeGetTopHistoryUseCase } from '../../../services/factories/make-get-top-history-use-case'
import {
  topHistoryBodySchema,
  topHistoryQuerySchema,
} from './schema/top-history.schema'

export async function topHistory(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.query as z.infer<typeof topHistoryQuerySchema>

  const { entityId, entityType, periodInDays, timeRange } =
    request.body as z.infer<typeof topHistoryBodySchema>

  const GetHistoryUseCase = makeGetTopHistoryUseCase()

  try {
    const { history } = await GetHistoryUseCase.execute({
      userId: id,
      entityId,
      entityType,
      periodInDays,
      timeRange, // TODO : fix me
    })
    reply.status(200).send({ history })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else {
      throw err
    }
  }
}