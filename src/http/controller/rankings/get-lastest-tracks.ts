import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { AxiosError } from 'axios'
import { SyncAlreadyDoneError } from '../../../services/errors/sync-already-done-error'
import { SnapshotNotFoundError } from '../../../services/errors/snapshot-not-found-error'
import { makeGetLatestTopTrackUseCase } from '../../../services/factories/make-get-latest-top-track-use-case'
import {
  getLatestTracksBodySchema,
  getLatestTracksQuerySchema,
} from './schema/get-latest-tracks.schema'

export async function getLatestTrack(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.query as z.infer<typeof getLatestTracksQuerySchema>

  const { timeRange } = request.body as z.infer<
    typeof getLatestTracksBodySchema
  >

  const GetLatestTopArtistUseCase = makeGetLatestTopTrackUseCase()

  try {
    const { track, snapshotDate } = await GetLatestTopArtistUseCase.execute({
      userId: id,
      timeRange,
    })
    reply.status(200).send({ tracks: track, snapshotDate })
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