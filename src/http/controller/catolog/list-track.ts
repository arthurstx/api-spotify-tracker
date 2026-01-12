import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { makeListTrackedTrackUseCase } from '../../../services/factories/make-list-tracked-track-use-case'

export async function listTrack(request: FastifyRequest, reply: FastifyReply) {
  const listTrackQuerySchema = z.object({
    id: z.uuid(),
  })

  const { id } = listTrackQuerySchema.parse(request.query)

  const ListTrackedTracksUseCase = makeListTrackedTrackUseCase()

  try {
    const { tracks } = await ListTrackedTracksUseCase.execute({
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
