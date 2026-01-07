import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeAuthenticateUseCase } from '../../../services/factories/make-authenticate-use-case'

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
    console.error(err)
  }
}
