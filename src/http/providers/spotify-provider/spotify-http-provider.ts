import axios from 'axios'
import {
  SpotifyArtist,
  SpotifyProvider,
  SpotifyProviderAuthenticationResponse,
  SpotifyProviderRefreshTokenResponse,
  SpotifyTrack,
} from '../../../provider/spotify-provider-types'

interface tokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  token_type: string
}

export class SpotifyHttpProvider implements SpotifyProvider {
  async getTokensByCode(code: string, state: string) {
    if (!code || !state) {
      return null
    }

    const params = new URLSearchParams()
    params.append('code', code)
    params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI!)
    params.append('grant_type', 'authorization_code')

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
      }
    )

    const data = response.data as tokenResponse

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expires_in: data.expires_in,
    } as SpotifyProviderAuthenticationResponse
  }

  async getMe(acess_token: string) {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + acess_token,
      },
    })

    const data = await response.data

    return data
  }
  getTopTracks(): Promise<SpotifyTrack[]> {
    throw new Error('Method not implemented.')
  }
  getTopArtists(): Promise<SpotifyArtist[]> {
    throw new Error('Method not implemented.')
  }
  refreshAcessToken(
    refreshToken: string
  ): Promise<SpotifyProviderRefreshTokenResponse | null> {
    throw new Error('Method not implemented.')
  }
}
