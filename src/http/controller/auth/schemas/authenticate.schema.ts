import z from 'zod'

export const authenticateQuerySchema = z.object({
  code: z
    .string()
    .min(1)
    .describe('The authorization code received from the OAuth provider'),
  state: z.string().describe('The state parameter to prevent CSRF attacks'),
})

export const authenticateResponseSchema = z.object({
  id: z.string(),
  spotifyId: z.string(),
  displayName: z.string(),
  email: z.string().nullable(),
  imageUrl: z.string().nullable(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenExpiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
