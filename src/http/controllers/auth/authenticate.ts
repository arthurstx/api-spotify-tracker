import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeAuthenticateUseCase } from '../../../services/factories/make-authenticate-use-case'
import { AuthenticationError } from '../../../services/errors/authentication-Error'
import { GetProfileError } from '../../../services/errors/get-profile-error'
import { AxiosError } from 'axios'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateQuerySchema = z.object({
    code: z.string().min(1),
    state: z.string(),
  })

  const { code, state } = authenticateQuerySchema.parse(request.query)

  const authenticateUseCase = makeAuthenticateUseCase()

  try {
    const { user } = await authenticateUseCase.execute({ code, state })
    reply.status(201).send(user)
  } catch (err) {
    if (err instanceof AuthenticationError) {
      return reply.status(404).send({ message: err })
    } else if (err instanceof GetProfileError) {
      return reply.status(403).send({ message: err })
    } else if (err instanceof AxiosError) {
      return reply.status(400).send({ message: err })
    }
  }
}
