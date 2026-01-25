import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'
import { makeGetTopItemsUseCase } from '../../../services/factories/make-get-top-tems'
import {
  getItemsBodySchema,
  getItemsQuerySchema,
} from './schema/get-items.schema'

export async function getItems(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.query as z.infer<typeof getItemsQuerySchema>

  const { entity } = request.body as z.infer<typeof getItemsBodySchema>

  const getTopItemsUseCase = makeGetTopItemsUseCase()

  try {
    const { normalizeEntity } = await getTopItemsUseCase.execute({
      userId: id,
      entity,
    })
    reply.status(200).send({ items: normalizeEntity })
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
