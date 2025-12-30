export interface SpotifyProviderAuthenticationResponse {
  accessToken: string
  refreshToken: string
  expires_in: number
}

export interface SpotifyProviderGetMeResponse {
  spotifyId: string
  email: string
}

export interface SpotifyProvider {
  getTokensByCode(
    code: string
  ): Promise<SpotifyProviderAuthenticationResponse | null>
  getMe(acess_token: string): Promise<SpotifyProviderGetMeResponse | null>
}
