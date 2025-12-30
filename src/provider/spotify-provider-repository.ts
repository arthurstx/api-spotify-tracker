export interface SpotifyProviderAuthenticationResponse {
  accessToken: string
  refreshToken: string
  expires_in: number
}

export interface SpotifyProviderGetMeResponse {
  displayName: string
  imageUrl: string
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
  type: 'artist'
  uri: string

  href: string
  external_urls: {
    spotify: string
  }
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyAlbum {
  album_type: 'album' | 'single' | 'compilation'
  total_tracks: number
  available_markets: string[]

  external_urls: {
    spotify: string
  }

  href: string
  id: string

  images: SpotifyImage[]

  name: string
  release_date: string
  release_date_precision: 'year' | 'month' | 'day'

  restrictions?: {
    reason: string
  }

  type: 'album'
  uri: string

  artists: SpotifyArtist[]
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
