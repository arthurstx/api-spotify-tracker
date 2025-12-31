import { randomUUID } from 'node:crypto'
import { Track } from '../../../generated/prisma/browser'
import { TrackCreateInput } from '../../../generated/prisma/models'
import { TracksRepository } from '../tracks-repository'

export class InMemoryTracksRepository implements TracksRepository {
  public items: Track[] = []
  async upsertMany(data: TrackCreateInput[]) {
    return data.map((input) => {
      const existingTrack = this.items.find((item) => item.id === input.id)

      if (!existingTrack) {
        const newTrack: Track = {
          id: randomUUID(),
          createdAt: new Date(),
          imageUrl: input.imageUrl ?? null,
          name: input.name,
          spotifyId: input.spotifyId,
          durationMs: input.durationMs,
        }
        this.items.push(newTrack)
        return newTrack
      } else {
        return {
          ...existingTrack,
          imageUrl: input.imageUrl ?? null,
          name: input.name,
        }
      }
    })
  }
}
