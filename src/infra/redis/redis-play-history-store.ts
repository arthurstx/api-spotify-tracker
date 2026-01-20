import {
  PlayHistoryStore,
  RegisterPlayParams,
} from '../../applications/ports/play-history-store'
import { redis } from '../../lib/redis'

export class RedisPlayHistoryStore implements PlayHistoryStore {
  async registerPlay({ userId, playsHistory }: RegisterPlayParams) {
    const pipeline = redis.multi()
    let countArtists = 0
    let countTracks = 0

    for (const { trackId, playedAt, artistIds } of playsHistory) {
      const dedupKey = `playHistory:user:${userId}:track:${trackId}:playedAt:${playedAt.toISOString()}`
      pipeline.set(dedupKey, '1', {
        NX: true,
        EX: 60 * 60 * 24,
      })

      const trackKey = `trackPlayHistory:user:${userId}`
      pipeline.hIncrBy(trackKey, trackId, 1)
      for (const artistId of artistIds) {
        const artistKey = `artistPlayHistory:user:${userId}:artist:${artistId}`
        pipeline.hIncrBy(artistKey, trackId, 1)
        countArtists++
      }
      countTracks++
    }

    await pipeline.exec()
    const total = countArtists + countTracks
    return total
  }
}
