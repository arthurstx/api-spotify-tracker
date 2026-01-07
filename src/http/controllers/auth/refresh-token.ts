import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeRefreshTokenUseCase } from '../../../services/factories/make-refresh-token-use-case'

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateQuerySchema = z.object({
    id: z.uuid(),
  })

  const { id } = authenticateQuerySchema.parse(request.query)

  const refreshTokenUseCase = makeRefreshTokenUseCase()

  try {
    const { accessToken, tokenExpiresAt } = await refreshTokenUseCase.execute({
      userId: id,
    })
    reply.status(201).send({ accessToken, tokenExpiresAt })
  } catch (err) {
    console.error(err)
  }
}
