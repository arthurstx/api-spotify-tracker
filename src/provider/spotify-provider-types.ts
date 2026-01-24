import { TimeRange } from '../../generated/prisma/enums'

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
  external_urls: {
    spotify: string
  }
  genres: string[]
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  popularity: number
  type: 'artist'
  uri: string
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

  name: string
  id: string
  images: SpotifyImage[]

  duration_ms: number
}

export interface RecentlyPlayedSpotifyTrack {
  track: SpotifyTrack

  played_at: string
}

export interface SpotifyProvider {
  getRecentlyPlayedTracks(
    access_token: string,
  ): Promise<RecentlyPlayedSpotifyTrack[]>
  getTopTracks(
    access_token: string,
    timeRange: TimeRange,
  ): Promise<SpotifyTrack[]>
  getTopArtists(
    access_token: string,
    timeRange: TimeRange,
  ): Promise<SpotifyArtist[]>
  getTokensByCode(
    code: string,
    state?: string,
  ): Promise<SpotifyProviderAuthenticationResponse | null>
  getMe(acess_token: string): Promise<SpotifyUserProfile | null>
  refreshAcessToken(
    refreshToken: string,
  ): Promise<SpotifyProviderRefreshTokenResponse | null>
}
