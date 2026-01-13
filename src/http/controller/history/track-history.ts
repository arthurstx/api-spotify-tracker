import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { makeGetTrackHistoryUseCase } from '../../../services/factories/make-get-track-history-use-case'
import { TrackNotFoundError } from '../../../services/errors/track-not-found-error'

export async function trackHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const geTrackHistoryQuerySchema = z.object({
    id: z.uuid(),
  })

  const geTrackHistoryBodySchema = z.object({
    trackId: z.string(),
    timeRange: z.enum(TimeRange).optional(),
  })

  const { id } = geTrackHistoryQuerySchema.parse(request.query)

  const { trackId, timeRange } = geTrackHistoryBodySchema.parse(request.body)

  const GetLatestTopArtistUseCase = makeGetTrackHistoryUseCase()

  try {
    const { track, history } = await GetLatestTopArtistUseCase.execute({
      userId: id,
      trackId,
      timeRange, // TODO : fix me
    })
    reply.status(200).send({ track, history })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof TrackNotFoundError) {
      return reply.status(402).send({ message: err.message })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    } else {
      throw err
    }
  }
}
