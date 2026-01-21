import {
  RecentlyPlayedSpotifyTrack,
  SpotifyArtist,
  SpotifyProvider,
} from '../provider/spotify-provider-types'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenUseCase } from './refresh-token'
import { UserNotFoundError } from './errors/user-not-found-error'
import { TrackArtistsRepository } from '../repository/track-artists-repository'
import { PlayHistoryStore } from '../applications/ports/play-history-store'

interface SyncTopStatsUseCaseRequest {
  userId: string
}

interface SyncTopStatsUseCaseResponse {
  count: number
}

function mapExternalTrackToPlayHistory(rawTrack: RecentlyPlayedSpotifyTrack) {
  const trackImage = rawTrack.track.images?.[0]?.url ?? null
  return {
    track: {
      name: rawTrack.track.name,
      imageUrl: trackImage,
      spotifyId: rawTrack.track.id,
      durationMs: rawTrack.track.duration_ms,
    },
    artists: rawTrack.track.artists.map((artist: SpotifyArtist) => {
      const artistImage = artist.images?.[0]?.url ?? null
      return {
        name: artist.name,
        imageUrl: artistImage,
        spotifyId: artist.id,
      }
    }),
    playedAt: new Date(rawTrack.played_at),
  }
}

export class SyncTopStatsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trackArtistsRepository: TrackArtistsRepository,
    private spotifyProvider: SpotifyProvider,
    private playHistoryCache: PlayHistoryStore,
  ) {}

  async execute({
    userId,
  }: SyncTopStatsUseCaseRequest): Promise<SyncTopStatsUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.tokenExpiresAt < new Date()) {
      const refreshToken = new RefreshTokenUseCase(
        this.usersRepository,
        this.spotifyProvider,
      )

      const { accessToken, tokenExpiresAt } = await refreshToken.execute({
        userId,
      })
      user.accessToken = accessToken
      user.tokenExpiresAt = tokenExpiresAt
    }

    const recentlyPlayedTracksResponse =
      await this.spotifyProvider.getRecentlyPlayedTracks(user.accessToken)

    const playsHistory = recentlyPlayedTracksResponse.map(
      mapExternalTrackToPlayHistory,
    )

    await this.playHistoryCache.registerPlay({
      userId,
      playsHistory,
    })

    const trackAndArtistSpotifyIds = recentlyPlayedTracksResponse.map(
      (track) => {
        return {
          trackId: track.track.id,
          artistId: track.track.artists.map((artist) => artist.id),
        }
      },
    )

    await this.trackArtistsRepository.create(trackAndArtistSpotifyIds)
    const count = recentlyPlayedTracksResponse.length
    return { count }
  }
}
