import { SpotifyProvider } from '../provider/spotify-provider-repository'
import { ArtistsRepository } from '../repository/artists-repository'
import { RankingsRepository } from '../repository/rankings-repository'
import { Artist } from '../../generated/prisma/browser'
import dayjs from 'dayjs'

interface SyncTopStatsUseCaseRequest {
  userId: string
}

interface SyncTopStatsUseCaseResponse {
  count: number
}

export class SyncTopStatsUseCase {
  constructor(
    private artistsRepository: ArtistsRepository,
    private rankingsRepository: RankingsRepository,
    private spotifyProvider: SpotifyProvider
  ) {}

  async execute({
    userId,
  }: SyncTopStatsUseCaseRequest): Promise<SyncTopStatsUseCaseResponse> {
    const topArtists = await this.spotifyProvider.getTopArtists()
    const startoftheday = dayjs(new Date()).startOf('day')

    let index = 0

    let artist: Artist

    for (const item of topArtists) {
      const existingArtist = await this.artistsRepository.findById(item.id)

      if (existingArtist) {
        artist = await this.artistsRepository.update({
          name: item.name,
          genres: item.genres,
          imageUrl: item.images[0]?.url ?? null,
        })
      } else {
        artist = await this.artistsRepository.create({
          spotifyId: item.id,
          name: item.name,
          genres: item.genres,
        })
      }

      await this.rankingsRepository.createMany({
        period: 'daily',
        position: index + 1,
        capturedAt: startoftheday.toDate(),
        userId,
        artistId: artist.id,
      })

      index++
    }

    return {
      count: index,
    }
  }
}
