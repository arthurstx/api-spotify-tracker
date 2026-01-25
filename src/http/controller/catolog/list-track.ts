import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { makeListTrackedTrackUseCase } from '../../../services/factories/make-list-tracked-track-use-case'
import { listTrackQuerySchema } from './schema/list-track.schema'

export async function listTrack(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.query as z.infer<typeof listTrackQuerySchema>

  const listTrackedTracksUseCase = makeListTrackedTrackUseCase()

  try {
    const { tracks } = await listTrackedTracksUseCase.execute({
      userId: id,
    })
    reply.status(200).send({ tracks })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else {
      throw err
    }
  }
}
