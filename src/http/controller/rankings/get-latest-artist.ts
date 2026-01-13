import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { TimeRange } from '../../../../generated/prisma/enums'
import { makeGetLatestTopArtistsUseCase } from '../../../services/factories/make-get-latest-top-artists-use-case'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'

export async function getLatestArtists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getLatestArtistsQuerySchema = z.object({
    id: z.uuid(),
  })

  const getLatestArtistsBodySchema = z.object({
    timeRange: z.enum(TimeRange).optional(),
  })

  const { id } = getLatestArtistsQuerySchema.parse(request.query)

  const { timeRange } = getLatestArtistsBodySchema.parse(request.body)

  const GetLatestTopArtistUseCase = makeGetLatestTopArtistsUseCase()

  try {
    const { artist, snapshotDate } = await GetLatestTopArtistUseCase.execute({
      userId: id,
      timeRange, // TODO : fix me
    })
    reply.status(200).send({ artist, snapshotDate })
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
