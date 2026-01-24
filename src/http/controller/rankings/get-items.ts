import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'
import { makeGetTopItemsUseCase } from '../../../services/factories/make-get-top-tems'

export async function getItems(request: FastifyRequest, reply: FastifyReply) {
  const getItemsQuerySchema = z.object({
    id: z.uuid(),
  })

  const getItemsBodySchema = z.object({
    timeRange: z.enum(TimeRange),
    entity: z.enum(['artists', 'tracks']),
  })

  const { id } = getItemsQuerySchema.parse(request.query)

  const { timeRange, entity } = getItemsBodySchema.parse(request.body)

  const getTopItemsUseCase = makeGetTopItemsUseCase()

  try {
    const { normalizeEntity } = await getTopItemsUseCase.execute({
      userId: id,
      entity,
      timeRange, // TODO : fix me
    })
    reply.status(200).send({ normalizeEntity })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof SnapshotNotFoundError) {
      return reply.status(402).send({ message: err.message })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    } else {
      throw err
    }
  }
}
