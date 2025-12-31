import {
  SpotifyArtist,
  SpotifyProvider,
  SpotifyTrack,
  Track,
} from '../provider/spotify-provider-repository'
import { ArtistsRepository } from '../repository/artists-repository'
import dayjs from 'dayjs'
import { TracksRepository } from '../repository/tracks-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenUseCase } from './refresh-token'
import { SnapShotsRepository } from '../repository/snapshots-repository'

interface SyncTopStatsUseCaseRequest {
  userId: string
}

interface SyncTopStatsUseCaseResponse {
  count: number
}

function mapExternalArtistToArtist(rawArtist: SpotifyArtist) {
  const image = rawArtist.image?.[0]?.url ?? null
  return {
    name: rawArtist.name,
    imageUrl: image,
    spotifyId: rawArtist.id,
  }
}

function mapExternalTrackToTrack(rawTrack: SpotifyTrack) {
  const image = rawTrack.artists[0].image[0].url ?? null
  return {
    name: rawTrack.album.name,
    imageUrl: image,
    spotifyId: rawTrack.album.id,
    durationMs: rawTrack.duration_ms,
  } as Track
}

export class SyncTopStatsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private artistsRepository: ArtistsRepository,
    private artistRankingsRepository: ArtistRankingsRepository,
    private tracksRepository: TracksRepository,
    private trackRankingsRepository: TrackRankingsRepository,
    private snapShot: SnapShotsRepository,
    private spotifyProvider: SpotifyProvider
  ) {}

  async execute({
    userId,
  }: SyncTopStatsUseCaseRequest): Promise<SyncTopStatsUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new Error()
    }

    if (user.tokenExpiresAt < new Date()) {
      const refreshToken = new RefreshTokenUseCase(
        this.usersRepository,
        this.spotifyProvider
      )

      refreshToken.execute({ userId })
    }

    const startoftheday = dayjs(new Date()).startOf('day').toDate()

    const existingSnapshot = await this.snapShot.findByUserAndDate(
      userId,
      startoftheday
    )

    if (existingSnapshot) {
      throw Error()
    }

    const topArtistsResponse = await this.spotifyProvider.getTopArtists()
    const topTracksResponse = await this.spotifyProvider.getTopTracks()
    const Artist = topArtistsResponse.map(mapExternalArtistToArtist)
    const track = topTracksResponse.map(mapExternalTrackToTrack)
  }
}
