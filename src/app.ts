import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { env } from './env/index.js'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifyCors } from '@fastify/cors'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { authRoutes } from './http/controllers/auth/routes.js'
import { spotifyProviderRoutes } from './http/providers/spotify-provider/controllers/routes.js'
import { snapshotRoutes } from './http/controllers/snapshot/routes.js'
import dns from 'node:dns'
import { rankingsRoutes } from './http/controllers/rankings/routes.js'
import { historyRoutes } from './http/controllers/history/routes.js'
import { catalogRoutes } from './http/controllers/catolog/routes.js'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

dns.setDefaultResultOrder('ipv4first')

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
})
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'spotify tracker',
      description:
        'A RESTful API to monitor, log, and analyze Spotify user listening data and trends',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

/**----- Routes -----*/
app.register(spotifyProviderRoutes)
app.register(authRoutes)
app.register(snapshotRoutes)
app.register(rankingsRoutes)
app.register(historyRoutes)
app.register(catalogRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
