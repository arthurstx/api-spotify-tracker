import {
  SpotifyArtist,
  SpotifyProvider,
  SpotifyTrack,
} from '../provider/spotify-provider-types'
import { ArtistsRepository } from '../repository/artists-repository'
import { TracksRepository } from '../repository/tracks-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenUseCase } from './refresh-token'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { Artist, TimeRange, Track } from '../../generated/prisma/browser'
import { UserNotFoundError } from './errors/user-not-found-error'
import { SyncAlreadyDoneError } from './errors/sync-already-done-error'
import { TrackArtistsRepository } from '../repository/track-artists-repository'
import { BatchPayload } from '../../generated/prisma/internal/prismaNamespace'

interface SyncTopStatsUseCaseRequest {
  userId: string
}

interface SyncTopStatsUseCaseResponse {
  count: number
}

function mapExternalArtistToArtist(rawArtist: SpotifyArtist) {
  const image = rawArtist.images?.[0]?.url ?? null
  return {
    name: rawArtist.name,
    imageUrl: image,
    spotifyId: rawArtist.id,
  }
}

function mapExternalTrackToTrack(rawTrack: SpotifyTrack) {
  const image = rawTrack.images?.[0]?.url ?? null
  return {
    name: rawTrack.name,
    imageUrl: image,
    spotifyId: rawTrack.id,
    durationMs: rawTrack.duration_ms,
  } as Track
}

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

export class SyncTopStatsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trackArtistsRepository: TrackArtistsRepository,
    private artistsRepository: ArtistsRepository,
    private artistRankingsRepository: ArtistRankingsRepository,
    private tracksRepository: TracksRepository,
    private trackRankingsRepository: TrackRankingsRepository,
    private snapShotRepository: SnapShotsRepository,
    private spotifyProvider: SpotifyProvider
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

    const topArtistsResponse = await this.spotifyProvider.getTopArtists(
      user.accessToken
    )
    const topTracksResponse = await this.spotifyProvider.getTopTracks(
      user.accessToken
    )

    const NormalizeArtist = topArtistsResponse.map(mapExternalArtistToArtist)
    const NormalizeTrack = topTracksResponse.map(mapExternalTrackToTrack)

    const snapShot = await this.snapShotRepository.create({
      userId,
      date: new Date(),
    })

    const artists = await this.artistsRepository.upsertMany(NormalizeArtist)
    const tracks = await this.tracksRepository.upsertMany(NormalizeTrack)

    const artistRanking = artists.map((item, index) =>
      mapExternalArtisToArtistRanking(item, index, snapShot.id)
    )

    const tracksRanking = tracks.map((item, index) =>
      mapExternalTracksToTrackstRanking(item, index, snapShot.id)
    )

    const countArtist = (await this.artistRankingsRepository.createMany(
      artistRanking
    )) as BatchPayload
    const countTracks = (await this.trackRankingsRepository.createMany(
      tracksRanking
    )) as BatchPayload

    const trackAndArtistSpotifyIds = topTracksResponse.map((track) => {
      return {
        trackId: track.id,
        artistId: track.artists.map((artist) => artist.id),
      }
    })

    await this.trackArtistsRepository.create(trackAndArtistSpotifyIds)
    const count = countArtist.count + countTracks.count
    return { count }
  }
}
