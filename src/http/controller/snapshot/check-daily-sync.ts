import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { makeCheckDailySyncStatusUseCase } from '../../../services/factories/make-check-daily-sync-status-use-case'
import { getDailyQuerySchema } from './schema/list-available.schema'

export async function syncStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.query as z.infer<typeof getDailyQuerySchema>

  const checkDailySyncStatusUseCase = makeCheckDailySyncStatusUseCase()

  try {
    const { hasSnapshotToday, snapshotDate } =
      await checkDailySyncStatusUseCase.execute({
        userId: id,
      })
    reply.status(200).send({ hasSnapshotToday, snapshotDate })
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
