import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { TrackNotFoundError } from '../../../services/errors/track-not-found-error'
import { makeGetArtistHistoryUseCase } from '../../../services/factories/make-get-artist-history'

export async function artistHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const geTrackHistoryQuerySchema = z.object({
    id: z.uuid(),
  })

  const geTrackHistoryBodySchema = z.object({
    artistId: z.string(),
    timeRange: z.enum(TimeRange).optional(),
  })

  const { id } = geTrackHistoryQuerySchema.parse(request.query)

  const { artistId, timeRange } = geTrackHistoryBodySchema.parse(request.body)

  const GetArtistHistoryUseCase = makeGetArtistHistoryUseCase()

  try {
    const { artist, history } = await GetArtistHistoryUseCase.execute({
      userId: id,
      artistId,
      timeRange, // TODO : fix me
    })
    reply.status(201).send({ artist, history })
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
