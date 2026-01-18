import {
  RecentlyPlayedSpotifyTrack,
  SpotifyArtist,
  SpotifyProvider,
} from '../provider/spotify-provider-types'
import { ArtistsRepository } from '../repository/artists-repository'
import { TracksRepository } from '../repository/tracks-repository'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenUseCase } from './refresh-token'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { PlayHistory, Track } from '../../generated/prisma/browser'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SyncAlreadyDoneError } from './errors/sync-already-done-error'
import { TrackArtistsRepository } from '../repository/track-artists-repository'
import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'
import { PlayHistoryRepository } from '../repository/Play-history-repository'

interface SyncTopStatsUseCaseRequest {
  userId: string
}

interface SyncTopStatsUseCaseResponse {
  count: number
}

function mapExternalTrackToArtist(rawArtist: SpotifyArtist) {
  const image = rawArtist.images?.[0]?.url ?? null
  return {
    name: rawArtist.name,
    imageUrl: image,
    spotifyId: rawArtist.id,
  }
}

function mapExternalRecentlyPlayedTrackToPlayHistory(
  rawTrack: RecentlyPlayedSpotifyTrack
) {
  return {
    trackId: rawTrack.track.id,
    playedAt: new Date(rawTrack.played_at),
  } as PlayHistory
}
function mapExternalTrackToTrack(rawTrack: RecentlyPlayedSpotifyTrack) {
  const image = rawTrack.track.images?.[0]?.url ?? null
  return {
    name: rawTrack.track.name,
    imageUrl: image,
    spotifyId: rawTrack.track.id,
    durationMs: rawTrack.track.duration_ms,
  } as Track
}
/*
function mapExternalArtisToArtistRanking(
  rawArtist: Artist,
  index: number,
  snapshotId: string
) {
  return {
    snapshotId: snapshotId,
    artistId: rawArtist.id,
    position: index + 1,
    timeRange: 'MEDIUM_TERM' as TimeRange,
  }
}

function mapExternalTracksToTrackstRanking(
  rawTrack: Track,
  index: number,
  snapshotId: string
) {
  return {
    snapshotId: snapshotId,
    trackId: rawTrack.id,
    position: index + 1,
    timeRange: 'MEDIUM_TERM' as TimeRange,
  }
}
*/
export class SyncTopStatsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trackArtistsRepository: TrackArtistsRepository,
    private artistsRepository: ArtistsRepository,
    private tracksRepository: TracksRepository,
    private snapShotRepository: SnapShotsRepository,
    private spotifyProvider: SpotifyProvider,
    private playHistoryRepository: PlayHistoryRepository
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
        this.spotifyProvider
      )

      const { accessToken, tokenExpiresAt } = await refreshToken.execute({
        userId,
      })
      user.accessToken = accessToken
      user.tokenExpiresAt = tokenExpiresAt
    }

    const existingSnapshot = await this.snapShotRepository.findByUserAndDate(
      userId,
      new Date()
    )
    if (existingSnapshot) {
      throw new SyncAlreadyDoneError()
    }

    const recentlyPlayedTracksResponse =
      await this.spotifyProvider.getRecentlyPlayedTracks(user.accessToken)

    const artistsWhitoutFormated = recentlyPlayedTracksResponse.flatMap(
      (track) => track.track.artists
    )

    const normalizeTrack = recentlyPlayedTracksResponse.map(
      mapExternalTrackToTrack
    )

    const normalizeArtists = artistsWhitoutFormated.map(
      mapExternalTrackToArtist
    )

    await this.snapShotRepository.create({
      userId,
      date: new Date(),
    })

    await this.artistsRepository.upsertMany(normalizeArtists)
    await this.tracksRepository.upsertMany(normalizeTrack)

    const playHistory = recentlyPlayedTracksResponse.map(
      mapExternalRecentlyPlayedTrackToPlayHistory
    )

    const countPlayHistory = (await this.playHistoryRepository.createMany(
      userId,
      playHistory
    )) as BatchPayload

    const trackAndArtistSpotifyIds = recentlyPlayedTracksResponse.map(
      (track) => {
        return {
          trackId: track.track.id,
          artistId: track.track.artists.map((artist) => artist.id),
        }
      }
    )

    await this.trackArtistsRepository.create(trackAndArtistSpotifyIds)
    const count = countPlayHistory.count
    return { count }
  }
}
