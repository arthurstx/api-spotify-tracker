import { app } from './app'
import { env } from './env'

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`✅ http running server http://127.0.0.1:${env.PORT}`)
  console.log(`📚 docs avaiableat http://127.0.0.1:${env.PORT}/docs`)
})
