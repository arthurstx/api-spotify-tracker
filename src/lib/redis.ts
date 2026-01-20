import { createClient } from 'redis'

export const redis = createClient({
  url: process.env.REDIS_URL, // ex: redis://localhost:6379
})

redis.on('error', (err) => {
  console.error('Redis error', err)
})
;(async () => {
  await redis.connect()
})()
