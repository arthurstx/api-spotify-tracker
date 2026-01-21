import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { PlayHistoryStore } from '../applications/ports/play-history-store'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { ArtistRankingsRepository } from '../repository/artist-rankings-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { ArtistsRepository } from '../repository/artists-repository'
import { TracksRepository } from '../repository/tracks-repository'
import { TimeRange } from '../../generated/prisma/enums'
import { SyncAlreadyDoneError } from './errors/sync-already-done-error'

interface HistoryRankingUseCaseRequest {
  userId: string
}

interface HistoryRankingUseCaseResponse {
  count: number
}

export class HistoryRankingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private artistsRepository: ArtistsRepository,
    private tracksRepository: TracksRepository,
    private artistRankingRepository: ArtistRankingsRepository,
    private tracksRankingRepository: TrackRankingsRepository,
    private snapshotsRepository: SnapShotsRepository,
    private playHistoryCache: PlayHistoryStore,
  ) {}

  async execute({
    userId,
  }: HistoryRankingUseCaseRequest): Promise<HistoryRankingUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const existingSnapshot = await this.snapshotsRepository.findLatest(userId)
    if (existingSnapshot) {
      throw new SyncAlreadyDoneError()
    }
    const snapshot = await this.snapshotsRepository.create({
      userId,
      date: new Date(),
    })

    const artistiIdWithFrequency =
      await this.playHistoryCache.getArtistsRanking(userId)
    const trackIdWithFrequency =
      await this.playHistoryCache.getTracksRanking(userId)

    await this.artistsRepository.upsertMany(
      artistiIdWithFrequency.map((artist) => {
        return {
          name: artist.name,
          spotifyId: artist.spotifyId,
          imageUrl: artist.imageUrl,
        }
      }),
    )
    await this.tracksRepository.upsertMany(
      trackIdWithFrequency.map((track) => {
        return {
          name: track.name,
          spotifyId: track.spotifyId,
          imageUrl: track.imageUrl,
          durationMs: track.durationMs,
        }
      }),
    )

    const artistRanking = artistiIdWithFrequency
      .sort((a, b) => b.playCount - a.playCount)
      .map((artist, index) => ({
        snapshotId: snapshot.id,
        artistId: artist.spotifyId,
        position: index + 1,
        timeRange: TimeRange.SHORT_TERM, // TODO: fix me
      }))
      .slice(0, 30)

    const trackRanking = trackIdWithFrequency
      .sort((a, b) => b.playCount - a.playCount)
      .map((track, index) => ({
        trackId: track.spotifyId,
        snapshotId: snapshot.id,
        position: index + 1,
        timeRange: TimeRange.SHORT_TERM, // TODO: fix me
      }))
      .slice(0, 30)

    const artistRankingResult = (await this.artistRankingRepository.createMany(
      artistRanking,
    )) as number
    const trackRankingResult = (await this.tracksRankingRepository.createMany(
      trackRanking,
    )) as number

    console.log(artistRankingResult, trackRankingResult)

    return { count: artistRankingResult + trackRankingResult } // TODO: fix me
  }
}
