import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { env } from '../env/index.js'
import { PrismaClient } from '../../generated/prisma/client.js'

const url = new URL(process.env.DATABASE_URL!)
const schema = url.searchParams.get('schema') ?? 'public'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool, { schema })

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
