import {
  SpotifyProvider,
  type SpotifyProviderGetMeResponse,
  type SpotifyProviderAuthenticationResponse,
  SpotifyProviderRefreshTokenResponse,
  type SpotifyArtist,
  SpotifyTrack,
} from '../spotify-provider-repository'

export class SpotifyProviderMock implements SpotifyProvider {
  async getTopTracks() {
    const spotifyAlbumsMock: SpotifyTrack[] = [
      {
        album: {
          album_type: 'album' as const,
          total_tracks: 12,
          available_markets: ['BR', 'US'],
          external_urls: {
            spotify: 'https://open.spotify.com/album/1',
          },
          href: 'https://api.spotify.com/v1/albums/1',
          id: '1',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d00001e021111',
              height: 300,
              width: 300,
            },
          ],
          name: 'Hybrid Theory',
          release_date: '2000-10-24',
          release_date_precision: 'day',
          type: 'album',
          uri: 'spotify:album:1',
        },
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/a1',
            },
            href: 'https://api.spotify.com/v1/artists/a1',
            id: 'a1',
            name: 'Linkin Park',
            type: 'artist',
            uri: 'spotify:artist:a1',
            image: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],
          },
        ],
        duration_ms: 202000,
      },
      {
        album: {
          album_type: 'album' as const,
          total_tracks: 10,
          available_markets: ['BR', 'CA'],
          external_urls: {
            spotify: 'https://open.spotify.com/album/2',
          },
          href: 'https://api.spotify.com/v1/albums/2',
          id: '2',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d00001e022222',
              height: 300,
              width: 300,
            },
          ],
          name: 'Back in Black',
          release_date: '1980-07-25',
          release_date_precision: 'day',
          type: 'album',
          uri: 'spotify:album:2',
        },
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/a2',
            },
            href: 'https://api.spotify.com/v1/artists/a2',
            id: 'a2',
            name: 'AC/DC',
            type: 'artist',
            uri: 'spotify:artist:a2',
            image: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],
          },
        ],
        duration_ms: 210000,
      },
      {
        album: {
          album_type: 'compilation' as const,
          total_tracks: 9,
          available_markets: ['BR', 'IT'],
          external_urls: {
            spotify: 'https://open.spotify.com/album/3',
          },
          href: 'https://api.spotify.com/v1/albums/3',
          id: '3',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d00001e023333',
              height: 300,
              width: 300,
            },
          ],
          name: 'Greatest Hits',
          release_date: '1981-12',
          release_date_precision: 'month',
          type: 'album',
          uri: 'spotify:album:3',
        },
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/a3',
            },
            href: 'https://api.spotify.com/v1/artists/a3',
            id: 'a3',
            name: 'Queen',
            type: 'artist',
            uri: 'spotify:artist:a3',
            image: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],
          },
        ],
        duration_ms: 215000,
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
        image: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],
        href: 'https://api.spotify.com/v1/artists/1dfeR4HaWDbWqFHLkxsg1d',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d',
        },
      },
      {
        id: '3WrFJ7ztbogyGnTHbHJFl2',
        name: 'The Beatles',
        type: 'artist',
        uri: 'spotify:artist:3WrFJ7ztbogyGnTHbHJFl2',
        image: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],

        href: 'https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2',
        },
      },
      {
        id: '711MCceyCBcFnzjGY4Q7Un',
        name: 'AC/DC',
        type: 'artist',
        uri: 'spotify:artist:711MCceyCBcFnzjGY4Q7Un',
        image: [{ url: 'urlDaImagemDoArtista1', width: 300, height: 300 }],

        href: 'https://api.spotify.com/v1/artists/711MCceyCBcFnzjGY4Q7Un',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/711MCceyCBcFnzjGY4Q7Un',
        },
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
      displayName: 'jhon doe',
      imageUrl: 'imageurl',
      email: 'jhondoe@example.com',
      spotifyId: 'spotify_id',
    }
    return response
  }
}
