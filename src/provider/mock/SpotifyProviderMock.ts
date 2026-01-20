import {
  SpotifyProvider,
  type SpotifyProviderAuthenticationResponse,
  SpotifyProviderRefreshTokenResponse,
  type SpotifyArtist,
  SpotifyTrack,
  SpotifyUserProfile,
  RecentlyPlayedSpotifyTrack,
} from '../spotify-provider-types'

export class SpotifyProviderMock implements SpotifyProvider {
  getRecentlyPlayedTracks(
    access_token: string,
  ): Promise<RecentlyPlayedSpotifyTrack[]> {
    throw new Error('Method not implemented.')
  }
  async getTopTracks() {
    const spotifyAlbumsMock: SpotifyTrack[] = [
      {
        id: '6qylu0VNKUfKiVi88WL3Ci',
        name: 'Marolento',
        duration_ms: 161379,
        images: [{ url: 'urlDaImagem', width: 300, height: 300 }],
        artists: [
          {
            id: '0zbO4WWM2wJM3ulFmCbMwB',
            name: 'Puterrier',
            type: 'artist',
            uri: 'spotify:artist:0zbO4WWM2wJM3ulFmCbMwB',
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0zbO4WWM2wJM3ulFmCbMwB',
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/0zbO4WWM2wJM3ulFmCbMwB',
            images: [{ url: 'urlDaImagem', width: 300, height: 300 }],
            popularity: 0,
          },
        ],
        album: {
          id: 'album1',
          name: 'Album Name',
          type: 'album',
          uri: 'spotify:album:album1',
          external_urls: {
            spotify: 'https://open.spotify.com/album/album1',
          },
          href: 'https://api.spotify.com/v1/albums/album1',
          images: [{ url: 'urlDaImagem', width: 300, height: 300 }],
          release_date: '2023-01-01',
          release_date_precision: 'day',
          album_type: 'album',
          total_tracks: 1,
          available_markets: ['BR', 'US'],
        },
      },
    ]

    return spotifyAlbumsMock
  }
  async getTopArtists() {
    const artists: SpotifyArtist[] = [
      {
        id: '1dfeR4HaWDbWqFHLkxsg1d',
        name: 'Queen',
        type: 'artist',
        uri: 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d',
        images: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],
        href: 'https://api.spotify.com/v1/artists/1dfeR4HaWDbWqFHLkxsg1d',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d',
        },
        genres: [],
        popularity: 0,
      },
      {
        id: '3WrFJ7ztbogyGnTHbHJFl2',
        name: 'The Beatles',
        type: 'artist',
        uri: 'spotify:artist:3WrFJ7ztbogyGnTHbHJFl2',
        images: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],

        href: 'https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2',
        },
        genres: [],
        popularity: 0,
      },
      {
        id: '711MCceyCBcFnzjGY4Q7Un',
        name: 'AC/DC',
        type: 'artist',
        uri: 'spotify:artist:711MCceyCBcFnzjGY4Q7Un',
        images: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],

        href: 'https://api.spotify.com/v1/artists/711MCceyCBcFnzjGY4Q7Un',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/711MCceyCBcFnzjGY4Q7Un',
        },
        genres: [],
        popularity: 0,
      },
    ]
    return artists
  }

  async refreshAcessToken(refreshToken: string) {
    if (refreshToken !== 'refresh_token') {
      return null
    }

    const response: SpotifyProviderRefreshTokenResponse = {
      access_token: 'new-access-token',
      expires_in: 3600,
      refresh_token: 'new-refresh-token',
      scope: 'user-top-read',
      token_type: 'Bearer',
    }
    return response
  }

  async getTokensByCode(code: string) {
    if (code !== 'valid-code') {
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
    if (acess_token !== 'acces_token') {
      return null
    }
    const response: SpotifyUserProfile = {
      display_name: 'jhon doe',
      images: [{ url: 'imageurl', height: 300, width: 300 }],
      email: 'jhondoe@example.com',
      id: 'spotify_id',
    }
    return response
  }
}
