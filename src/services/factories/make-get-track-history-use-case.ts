import { PrismaTrackRankingsRepository } from '../../repository/prisma/prisma-track-rankings-repository'
import { PrismaTracksRepository } from '../../repository/prisma/prisma-tracks-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { GetTrackHistoryUseCase } from '../get-track-history'

export function makeGetTrackHistoryUseCase() {
  const userRepository = new PrismaUserRepository()
  const trackRepository = new PrismaTracksRepository()
  const trackRankingRepository = new PrismaTrackRankingsRepository()
  const useCase = new GetTrackHistoryUseCase(
    trackRepository,
    userRepository,
    trackRankingRepository
  )

  return useCase
}
