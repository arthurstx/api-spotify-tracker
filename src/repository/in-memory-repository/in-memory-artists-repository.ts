import { randomUUID } from 'node:crypto'
import { Artist } from '../../../generated/prisma/browser'
import {
  ArtistCreateInput,
  ArtistUpdateInput,
} from '../../../generated/prisma/models'
import { ArtistsRepository } from '../artists-repository'

export class InMeMoryArtistsRepository implements ArtistsRepository {
  public items: Artist[] = []

  async findById(id: string) {
    const artist = await this.items.find((item) => item.id === id)
    return artist ?? null
  }

  async create(data: ArtistCreateInput) {
    const artist: Artist = {
      genres: data.genres as string[],
      id: data.id ?? randomUUID(),
      imageUrl: data.imageUrl ?? null,
      name: data.name,
      spotifyId: data.spotifyId ?? null,
    }
    this.items.push(artist)

    return artist
  }

  async update(data: ArtistUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.id === data.id)
 
     if (userIndex >= 0) {
       this.items[userIndex] = data as Artist
     }
 
     return data
   }

  }
