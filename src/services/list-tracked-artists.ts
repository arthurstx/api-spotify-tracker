import { ArtistReadRepository } from '../repository/artist-read-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface ListTrackedArtistsUseCaseRequest {
  userId: string
}

interface ListTrackedArtistsUseCaseResponse {
  artists: Array<{
    id: string
    name: string
    imageUrl: string | null
  }>
}

export class ListTrackedArtistsUseCase {
  constructor(
    private artistReadRepository: ArtistReadRepository,
    private userRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: ListTrackedArtistsUseCaseRequest): Promise<ListTrackedArtistsUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const artistsWhitoutFormated =
      await this.artistReadRepository.listTrackedByUser(userId)

    const artists = artistsWhitoutFormated.map((artist) => {
      return {
        id: artist.id,
        name: artist.name,
        imageUrl: artist.imageUrl ?? null,
      }
    })

    return { artists }
  }
}
