import { TimeRange } from '../../generated/prisma/enums'
import { ArtistRankingsReadRepository } from '../repository/artist-rankings-repository'
import { ArtistsRepository } from '../repository/artists-repository'
import { UsersRepository } from '../repository/user-repository'
import { ArtistNotFoundError } from './errors/artist-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetArtistHistoryUseCaseRequest {
  userId: string
  artistId: string
  timeRange?: TimeRange
}

interface GetArtistHistoryUseCaseResponse {
  artist: {
    id: string
    name: string
    imageUrl: string | null
  }

  history: Array<{
    date: Date
    position: number
    timeRange?: TimeRange
  }>
}

export class GetArtistHistoryUseCase {
  constructor(
    private artistRepository: ArtistsRepository,
    private userRepository: UsersRepository,
    private artistRankingsRead: ArtistRankingsReadRepository
  ) {}

  async execute({
    userId,
    artistId,
    timeRange,
  }: GetArtistHistoryUseCaseRequest): Promise<GetArtistHistoryUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const artist = await this.artistRepository.findById(artistId)

    if (!artist) {
      throw new ArtistNotFoundError()
    }

    const history = await this.artistRankingsRead.fetchHistory(
      userId,
      artistId,
      timeRange
    )

    return { artist, history }
  }
}
