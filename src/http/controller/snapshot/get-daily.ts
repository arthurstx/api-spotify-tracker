import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { RefreshTokenExpiredError } from '../../../services/errors/refresh-token-expired-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { makeGetDailySnapshotUseCase } from '../../../services/factories/make-get-daily-snapshot-use-case'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'

export async function getDaily(request: FastifyRequest, reply: FastifyReply) {
  const getDailyQuerySchema = z.object({
    id: z.uuid(),
  })

  const getDailyBodySchema = z.object({
    setSnapshotDate: z.coerce.date(),
    timeRange: z.enum(TimeRange),
  })

  const { id } = getDailyQuerySchema.parse(request.query)

  const { setSnapshotDate, timeRange } = getDailyBodySchema.parse(request.body)

  const GetDailySnapshotUseCase = makeGetDailySnapshotUseCase()

  try {
    const { artists, tracks, snapshotDate } =
      await GetDailySnapshotUseCase.execute({
        snapshotDate: setSnapshotDate,
        timeRange,
        userId: id,
      })
    reply.status(201).send({ artists, tracks, snapshotDate })
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
