import { TimeRange } from '../../generated/prisma/enums'
import { SnapShotsRepository } from '../repository/snapshots-repository'
import { TrackRankingsRepository } from '../repository/track-rankings-repository'
import { TracksRepository } from '../repository/tracks-repository'
import { UsersRepository } from '../repository/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

// TODO: add me

interface CompareTrackPerformanceUseCaseRequest {
  userId: string
  trackId: string
  fromDate: string
  toDate: string
  timeRange: TimeRange
}

interface CompareTrackPerformanceUseCaseResponse {
  track: {
    id: string
    name: string
  }

  from: {
    date: string
    position: number | null
  }

  to: {
    date: string
    position: number | null
  }

  delta: number | null
  trend: 'UP' | 'DOWN' | 'STABLE' | 'NOT_RANKED'
}

export class CompareTrackPerformanceUseCase {
  constructor(
    private trackRankingsRepository: TrackRankingsRepository,
    private trackRepository: TracksRepository,
    private snapshotRepository: SnapShotsRepository,
    private userRepository: UsersRepository
  ) {}

  async execute({
    userId,
    fromDate,
    timeRange,
    toDate,
    trackId,
  }: CompareTrackPerformanceUseCaseRequest): Promise<CompareTrackPerformanceUseCaseResponse> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const dateNow = new Date()

    const snapshot = await this.snapshotRepository.findByUserAndDate(
      userId,
      dateNow
    )

    const hasSnapshotToday: boolean = snapshot ? true : false

    const snapshotDate = snapshot?.createdAt

    return { snapshotDate, hasSnapshotToday }
  }
}
