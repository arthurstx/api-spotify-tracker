import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'

export async function userAuthorization(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const state = randomUUID()

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
  ].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state,
  }).toString()

  const authUrl = `https://accounts.spotify.com/authorize?${params}`

  return reply.redirect(authUrl)
}
