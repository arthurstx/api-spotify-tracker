import { randomUUID } from 'node:crypto'
import { Artist } from '../../../generated/prisma/browser'
import { ArtistCreateInput } from '../../../generated/prisma/models'
import { ArtistsRepository } from '../artists-repository'

export class InMemoryArtistsRepository implements ArtistsRepository {
  public items: Artist[] = []
  async upsertMany(data: ArtistCreateInput[]) {
    return data.map((input) => {
      const existingArtist = this.items.find((item) => item.id === input.id)

      if (!existingArtist) {
        const newArtist: Artist = {
          id: randomUUID(),
          createdAt: new Date(),
          imageUrl: input.imageUrl ?? null,
          name: input.name,
          spotifyId: input.spotifyId,
        }
        this.items.push(newArtist)
        return newArtist
      } else {
        return {
          ...existingArtist,
          imageUrl: input.imageUrl ?? null,
          name: input.name,
        }
      }
    })
  }
}
