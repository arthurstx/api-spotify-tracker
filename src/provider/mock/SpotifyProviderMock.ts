import {
  SpotifyProvider,
  type SpotifyProviderGetMeResponse,
  type SpotifyProviderAuthenticationResponse,
  SpotifyProviderRefreshTokenResponse,
} from '../spotify-provider-repository'

export class SpotifyProviderMock implements SpotifyProvider {
  async getTopArtists() {
    const artists = [
      {
        id: '7Ln80lUS6He07XvHI8qqHH',
        name: 'Foo Fighters',
        genres: ['rock', 'alternative rock'],
        popularity: 85,
        followers: {
          total: 12034567,
        },
        images: [
          {
            url: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
            height: 300,
            width: 300,
          },
        ],
      },
      {
        id: '5K4W6rqBFWDnAN6FQUkS6x',
        name: 'Kanye West',
        genres: ['hip hop', 'rap'],
        popularity: 92,
        followers: {
          total: 18123456,
        },
        images: [
          {
            url: 'https://i.scdn.co/image/ab6761610000e5eb4c8c0b5e7b5f7c5a8f2e1b3a',
            height: 640,
            width: 640,
          },
        ],
      },
      {
        id: '1vCWHaC5f2uS3yhpwWbIA6',
        name: 'Avicii',
        genres: ['edm', 'electronic', 'dance'],
        popularity: 80,
        followers: {
          total: 21567890,
        },
        images: [],
      },
    ]
    return artists
  }

  async refreshAcessToken(refreshToken: string) {
    if (refreshToken != 'refresh_token') {
      return null
    }

    const response: SpotifyProviderRefreshTokenResponse = {
      accessToken: 'new-access-token',
      expires_in: 3600,
      newRefreshToken: 'new-refresh-token',
    }
    return response
  }

  async getTokensByCode(code: string) {
    if (code != 'valid-code') {
      return null
    }

    const response: SpotifyProviderAuthenticationResponse = {
      accessToken: 'acces_token',
      expires_in: 3600,
      refreshToken: 'refresh_token',
    }

    return response
  }
  async getMe(acess_token: string) {
    if (acess_token != 'acces_token') {
      return null
    }
    const response: SpotifyProviderGetMeResponse = {
      email: 'jhondoe@example.com',
      spotifyId: 'spotify_id',
    }
    return response
  }
}
