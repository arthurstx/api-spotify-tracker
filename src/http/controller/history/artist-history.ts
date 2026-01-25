import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { makeGetArtistHistoryUseCase } from '../../../services/factories/make-get-artist-history'
import { ArtistNotFoundError } from '../../../services/errors/artist-not-found-error'
import {
  artistHistoryBodySchema,
  artistHistoryQuerySchema,
} from './schema/artist-history.schema'

export async function artistHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.query as z.infer<typeof artistHistoryQuerySchema>

  const { artistId } = request.body as z.infer<typeof artistHistoryBodySchema>

  const GetArtistHistoryUseCase = makeGetArtistHistoryUseCase()

  try {
    const { artist, history } = await GetArtistHistoryUseCase.execute({
      userId: id,
      artistId,
    })
    reply.status(200).send({ artist, history })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SyncAlreadyDoneError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof ArtistNotFoundError) {
      return reply.status(404).send({ message: err.message })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    } else {
      throw err
    }
  }
}
