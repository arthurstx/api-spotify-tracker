import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { makeListAvailableUseCase } from '../../../services/factories/make-list-available-use-case'
import { listAvailableQuerySchema } from './schema/list-available.schema'

export async function listAvailable(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.query as z.infer<typeof listAvailableQuerySchema>

  const listAvailableUseCase = makeListAvailableUseCase()

  try {
    const { snapshotDate } = await listAvailableUseCase.execute({
      userId: id,
    })
    reply.status(200).send({ snapshotDate })
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
