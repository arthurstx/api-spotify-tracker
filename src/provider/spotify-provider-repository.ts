export interface SpotifyProviderAuthenticationResponse {
  accessToken: string
  refreshToken: string
  expires_in: number
}

export interface SpotifyProviderGetMeResponse {
  spotifyId: string
  email: string
}

export interface SpotifyProviderRefreshTokenResponse {
  accessToken: string
  newRefreshToken: string | null
  expires_in: number
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  followers: {
    total: number
  }
  images: {
    url: string
    height: number
    width: number
  }[]
}

export interface SpotifyProvider {
  getTopArtists(): Promise<SpotifyArtist[]>
  getTokensByCode(
    code: string
  ): Promise<SpotifyProviderAuthenticationResponse | null>
  getMe(acess_token: string): Promise<SpotifyProviderGetMeResponse | null>
  refreshAcessToken(
    refreshToken: string
  ): Promise<SpotifyProviderRefreshTokenResponse | null>
}
