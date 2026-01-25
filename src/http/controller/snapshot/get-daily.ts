import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { RefreshTokenExpiredError } from '../../../services/errors/refresh-token-expired-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { makeGetDailySnapshotUseCase } from '../../../services/factories/make-get-daily-snapshot-use-case'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'
import {
  getDailyBodySchema,
  getDailyQuerySchema,
} from './schema/get-daily.schema'

export async function getDaily(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.query as z.infer<typeof getDailyQuerySchema>

  const { setSnapshotDate, timeRange } = request.body as z.infer<
    typeof getDailyBodySchema
  >

  const GetDailySnapshotUseCase = makeGetDailySnapshotUseCase()

  try {
    const { artists, tracks, snapshotDate } =
      await GetDailySnapshotUseCase.execute({
        snapshotDate: setSnapshotDate,
        timeRange,
        userId: id,
      })
    reply.status(200).send({ artists, tracks, snapshotDate })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof SnapshotNotFoundError) {
      return reply.status(404).send({ message: err.message })
    } else if (err instanceof RefreshTokenExpiredError) {
      return reply.status(402).send({ message: err.message })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    } else {
      throw err
    }
  }
}
