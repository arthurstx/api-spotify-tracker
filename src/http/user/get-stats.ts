import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeGetUserStatsUseCase } from '../../services/factories/make-get-user-stats'
import { UserNotFoundError } from '../../services/errors/user-not-found-error'
import { SnapshotNotFoundError } from '../../services/errors/snapshot-not-found-error'

export async function getStats(request: FastifyRequest, reply: FastifyReply) {
  const getStatsQuerySchema = z.object({
    id: z.uuid(),
  })

  const { id } = getStatsQuerySchema.parse(request.query)

  const getUserStatsUseCase = makeGetUserStatsUseCase()

  try {
    const {
      totalSnapshots,
      totalTrackedArtists,
      totalTrackedTracks,
      firstSnapshotDate,
      lastSnapshotDate,
    } = await getUserStatsUseCase.execute({
      userId: id,
    })
    reply.status(200).send({
      totalSnapshots,
      totalTrackedArtists,
      totalTrackedTracks,
      firstSnapshotDate,
      lastSnapshotDate,
    })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else if (err instanceof SnapshotNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } else {
      throw err
    }
  }
}
