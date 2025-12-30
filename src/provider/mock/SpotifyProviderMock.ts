import {
  SpotifyProvider,
  type SpotifyProviderGetMeResponse,
  type SpotifyProviderAuthenticationResponse,
} from '../spotify-provider-repository'

export class SpotifyProviderMock implements SpotifyProvider {
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
