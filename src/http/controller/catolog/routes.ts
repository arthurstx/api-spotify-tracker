import { FastifyInstance } from 'fastify'
import { listTrack } from './list-track'
import { listArtist } from './list-artist'

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/catalog/tracks', listTrack)
  app.get('/catalog/artists', listArtist)
}
