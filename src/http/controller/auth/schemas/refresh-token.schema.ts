import z from 'zod'

export const refreshTokenQuerySchema = z.object({
  id: z.uuid().describe('The unique identifier of the user'),
})

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().describe('The new access token for the user'),
  tokenExpiresAt: z
    .date()
    .describe('The expiration date of the new access token'),
})
