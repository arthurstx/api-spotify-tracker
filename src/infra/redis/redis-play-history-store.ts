import {
  PlayHistoryStore,
  RegisterPlayParams,
} from '../../applications/ports/play-history-store'
import { redis } from '../../lib/redis'

export class RedisPlayHistoryStore implements PlayHistoryStore {
  async getArtistsRanking(userId: string) {
    const data = await redis.zRangeWithScores(
      `artist:ranking:user:${userId}`,
      0,
      -1, // top 30
    )
    const artists = await Promise.all(
      data.map(async (d) => {
        const artistData = await redis.hGetAll(`artist:data:${d.value}`)

        return {
          spotifyId: d.value,
          name: artistData.name,
          imageUrl: artistData.imageUrl,
          playCount: Number(d.score),
        }
      }),
    )
    console.log(artists)

    return artists
  }

  async getTracksRanking(userId: string) {
    const data = await redis.zRangeWithScores(
      `track:ranking:user:${userId}`,
      0,
      -1, // top 30
    )

    const tracks = await Promise.all(
      data.map(async (d) => {
        const trackData = await redis.hGetAll(`track:data:${d.value}`)

        return {
          spotifyId: d.value,
          name: trackData.name,
          durationMs: Number(trackData.durationMs),
          imageUrl: trackData.imageUrl,

          playCount: Number(d.score),
        }
      }),
    )
    return tracks
  }

  async registerPlay({ userId, playsHistory }: RegisterPlayParams) {
    let countArtists = 0
    let countTracks = 0

    for (const { track, playedAt, artists } of playsHistory) {
      const dedupKey = `playHistory:user:${userId}:track:${track.spotifyId}:playedAt:${playedAt.toISOString()}`

      const wasInserted = await redis.set(dedupKey, '1', {
        NX: true,
        EX: 60 * 60 * 24,
      })

      if (!wasInserted) continue

      const pipeline = redis.multi()

      const trackDataKey = `track:data:${track.spotifyId}`
      const trackRankingKey = `track:ranking:user:${userId}`

      pipeline.hSet(trackDataKey, {
        id: track.spotifyId,
        name: track.name,
        durationMs: track.durationMs,
      })

      pipeline.zIncrBy(trackRankingKey, 1, track.spotifyId)
      countTracks++

      const artistRankingKey = `artist:ranking:user:${userId}`

      for (const artist of artists) {
        const artistDataKey = `artist:data:${artist.spotifyId}`

        pipeline.hSet(artistDataKey, {
          id: artist.spotifyId,
          name: artist.name,
        })

        pipeline.zIncrBy(artistRankingKey, 1, artist.spotifyId)
        countArtists++
      }

      await pipeline.exec()
    }

    return countArtists + countTracks
  }
}
