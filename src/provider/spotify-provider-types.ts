export interface SpotifyProviderAuthenticationResponse {
  accessToken: string
  refreshToken: string
  expires_in: number
}

export interface SpotifyUserProfile {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
}

export interface SpotifyProviderRefreshTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface SpotifyArtist {
  id: string
  name: string
  type: 'artist'
  uri: string
  image: [
    {
      url: string
      height: number
      width: number
    }
  ]

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
}

export interface SpotifyTrack {
  album: SpotifyAlbum

  artists: SpotifyArtist[]

  duration_ms: number
}

export interface SpotifyProvider {
  getTopTracks(): Promise<object>
  getTopArtists(): Promise<SpotifyArtist[]>
  getTokensByCode(
    code: string,
    state?: string
  ): Promise<SpotifyProviderAuthenticationResponse | null>
  getMe(acess_token: string): Promise<SpotifyUserProfile | null>
  refreshAcessToken(
    refreshToken: string
  ): Promise<SpotifyProviderRefreshTokenResponse | null>
}
