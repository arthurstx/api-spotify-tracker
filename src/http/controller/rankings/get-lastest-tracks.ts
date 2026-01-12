import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'
import { makeGetLatestTopTrackUseCase } from '../../../services/factories/make-get-latest-top-track-use-case'

export async function getLatestTrack(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getLatestTrackQuerySchema = z.object({
    id: z.uuid(),
  })

  const getLatestTrackBodySchema = z.object({
    timeRange: z.enum(TimeRange).optional(),
  })

  const { id } = getLatestTrackQuerySchema.parse(request.query)

  const { timeRange } = getLatestTrackBodySchema.parse(request.body)

  const GetLatestTopArtistUseCase = makeGetLatestTopTrackUseCase()

  try {
    const { track, snapshotDate } = await GetLatestTopArtistUseCase.execute({
      userId: id,
      timeRange, // TODO : fix me
    })
    reply.status(201).send({ track, snapshotDate })
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
