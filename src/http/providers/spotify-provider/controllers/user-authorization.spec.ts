import request from 'supertest'
import fastify from 'fastify'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { userAuthorization } from './user-authorization'

describe('GET /auth (Spotify authorization)', () => {
  let app: ReturnType<typeof fastify>

  beforeAll(async () => {
    process.env.SPOTIFY_CLIENT_ID = 'test-client-id'
    process.env.SPOTIFY_REDIRECT_URI = 'http://localhost/callback'

    app = fastify()
    app.get('/auth', userAuthorization)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should redirect to Spotify with correct authorization params', async () => {
    const response = await request(app.server).get('/auth').expect(302)

    const location = response.headers.location
    expect(location).toBeDefined()
    expect(location).toContain('https://accounts.spotify.com/authorize')

    const url = new URL(location)

    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('client_id')).toBe('test-client-id')
    expect(url.searchParams.get('redirect_uri')).toBe(
      'http://localhost/callback'
    )

    expect(url.searchParams.get('scope')).toBe(
      'user-read-private user-read-email user-top-read user-read-recently-played'
    )

    expect(url.searchParams.get('state')).toBeTruthy()
  })
})
