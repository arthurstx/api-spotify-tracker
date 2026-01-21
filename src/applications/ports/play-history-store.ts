// src/application/ports/play-history-store.ts
export interface RegisterPlayParams {
  userId: string
  playsHistory: Array<{
    track: {
      name: string
      imageUrl: string
      spotifyId: string
      durationMs: number
    }
    artists: {
      name: string
      imageUrl: string
      spotifyId: string
    }[]
    playedAt: Date
  }>
}
export interface PlayHistoryStore {
  registerPlay({ userId, playsHistory }: RegisterPlayParams): Promise<number>
  getArtistsRanking(
    userId: string,
  ): Promise<
    Array<{
      name: string
      imageUrl: string
      spotifyId: string
      playCount: number
    }>
  >
  getTracksRanking(userId: string): Promise<
    Array<{
      name: string
      imageUrl: string
      spotifyId: string
      durationMs: number
      playCount: number
    }>
  >
}
