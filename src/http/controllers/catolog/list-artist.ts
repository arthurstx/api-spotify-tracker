import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { makeListTrackedArtistUseCase } from '../../../services/factories/make-list-tracked-artists'

export async function listArtist(request: FastifyRequest, reply: FastifyReply) {
  const listArtistQuerySchema = z.object({
    id: z.uuid(),
  })

  const { id } = listArtistQuerySchema.parse(request.query)

  const ListArtistedArtistsUseCase = makeListTrackedArtistUseCase()

  try {
    const { artists } = await ListArtistedArtistsUseCase.execute({
      userId: id,
    })
    reply.status(200).send({ artists })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else {
      throw err
    }
  }
}
