// src/application/ports/play-history-store.ts
export interface RegisterPlayParams {
  userId: string
  playsHistory: Array<{
    trackId: string
    artistIds: string[]
    playedAt: Date
  }>
}
export interface PlayHistoryStore {
  registerPlay({ userId, playsHistory }: RegisterPlayParams): Promise<number>
}
