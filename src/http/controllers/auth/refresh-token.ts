import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeRefreshTokenUseCase } from '../../../services/factories/make-refresh-token-use-case'
import { UserNotFoundError } from '../../../services/errors/user-not-found-error'
import { RefreshTokenExpiredError } from '../../../services/errors/refresh-token-expired-error'
import { AxiosError } from 'axios'

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
    if (err instanceof UserNotFoundError) {
      return reply.status(403).send({ message: err })
    } else if (err instanceof RefreshTokenExpiredError) {
      return reply.status(402).send({ message: err })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    }
  }
}
