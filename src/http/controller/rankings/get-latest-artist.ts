import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { makeGetLatestTopArtistsUseCase } from '../../../services/factories/make-get-latest-top-artists-use-case'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'
import {
  getLatestArtistsBodySchema,
  getLatestArtistsQuerySchema,
} from './schema/get-latest-artists.schema'

export async function getLatestArtists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.query as z.infer<typeof getLatestArtistsQuerySchema>

  const GetLatestTopArtistUseCase = makeGetLatestTopArtistsUseCase()

  try {
    const { artist, snapshotDate } = await GetLatestTopArtistUseCase.execute({
      userId: id,
    })
    reply.status(200).send({ artists: artist, snapshotDate })
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
