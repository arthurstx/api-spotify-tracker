import { ArtistRankingsReadRepository } from '../repository/artist-rankings-repository'
import { ArtistsRepository } from '../repository/artists-repository'
import { UsersRepository } from '../repository/user-repository'
import { ArtistNotFoundError } from './errors/artist-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetArtistHistoryUseCaseRequest {
  userId: string
  artistId: string
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
  }>
}

export class GetArtistHistoryUseCase {
  constructor(
    private artistRepository: ArtistsRepository,
    private userRepository: UsersRepository,
    private artistRankingsRead: ArtistRankingsReadRepository,
  ) {}

  async execute({
    userId,
    artistId,
  }: GetArtistHistoryUseCaseRequest): Promise<GetArtistHistoryUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const artist = await this.artistRepository.findById(artistId)

    if (!artist) {
      throw new ArtistNotFoundError()
    }

    const history = await this.artistRankingsRead.fetchHistory(userId, artistId)

    return { artist, history }
  }
}
