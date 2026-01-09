import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { makeGetTopHistoryUseCase } from '../../../services/factories/make-get-top-history-use-case'

enum EntityType {
  ARTIST = 'ARTIST',
  TRACK = 'TRACK',
}

export async function topHistory(request: FastifyRequest, reply: FastifyReply) {
  const geTopHistoryQuerySchema = z.object({
    id: z.uuid(),
  })

  const geTopHistoryBodySchema = z.object({
    entityType: z.enum(EntityType),
    entityId: z.string(),
    timeRange: z.enum(TimeRange).optional(),
    periodInDays: z.number(),
  })

  const { id } = geTopHistoryQuerySchema.parse(request.query)

  const { entityId, entityType, periodInDays, timeRange } =
    geTopHistoryBodySchema.parse(request.body)

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
