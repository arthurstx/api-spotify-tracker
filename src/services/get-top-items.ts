import {
  SpotifyArtist,
  SpotifyProvider,
  SpotifyTrack,
} from '../provider/spotify-provider-types'
import { UsersRepository } from '../repository/user-repository'
import { RefreshTokenUseCase } from './refresh-token'
import { TimeRange } from '../../generated/prisma/browser'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetTopItemsUseCaseRequest {
  userId: string
  entity: 'artists' | 'tracks'
  timeRange: TimeRange
}

interface GetTopItemsUseCaseResponse {
  normalizeEntity:
    | {
        name: string
        imageUrl: string
        spotifyId: string
      }[]
    | {
        name: string
        id: string
        spotifyId: string
        imageUrl: string | null
        durationMs: number
        createdAt: Date
      }[]
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
  }
}

export class GetTopItemsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private spotifyProvider: SpotifyProvider,
  ) {}

  async execute({
    userId,
    entity,
    timeRange,
  }: GetTopItemsUseCaseRequest): Promise<GetTopItemsUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.tokenExpiresAt < new Date()) {
      const refreshToken = new RefreshTokenUseCase(
        this.usersRepository,
        this.spotifyProvider,
      )

      await refreshToken.execute({ userId })
    }

    let entityResponse
    let normalizeEntity

    switch (entity) {
      case 'artists':
        entityResponse = await this.spotifyProvider.getTopArtists(
          user.accessToken,
          timeRange,
        )
        normalizeEntity = entityResponse.map(mapExternalArtistToArtist)
        break
      case 'tracks':
        entityResponse = await this.spotifyProvider.getTopTracks(
          user.accessToken,
          timeRange,
        )
        normalizeEntity = entityResponse.map(mapExternalTrackToTrack)
        break
      default:
        throw new Error('Invalid entity type')
    }

    return { normalizeEntity } as GetTopItemsUseCaseResponse
  }
}
