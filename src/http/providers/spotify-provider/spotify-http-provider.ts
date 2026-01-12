import axios from 'axios'
import {
  SpotifyProvider,
  SpotifyProviderAuthenticationResponse,
  SpotifyTrack,
} from '../../../provider/spotify-provider-types'
import { TimeRange } from '../../../../generated/prisma/enums'

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

  async getMe(access_token: string) {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const data = await response.data

    return data
  }

  async getTopTracks(access_token: string): Promise<SpotifyTrack[]> {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          limit: 50,
          time_range: TimeRange.SHORT_TERM,
        },
      }
    )

    const data = response.data.items

    return data
  }

  async getTopArtists(access_token: string) {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/artists',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          limit: 50,
          time_range: TimeRange.SHORT_TERM,
        },
      }
    )

    const data = response.data.items

    return data
  }

  async refreshAcessToken(refreshToken: string) {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
      }),
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
    const data = response.data

    return data
  }
}
