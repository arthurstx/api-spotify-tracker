import { PrismaTracksRepository } from '../../repository/prisma/prisma-tracks-repository'
import { PrismaUserRepository } from '../../repository/prisma/prisma-user-repository'
import { ListTrackedTracksUseCase } from '../list-tracked-tracks'

export function makeListTrackedTrackUseCase() {
  const userRepository = new PrismaUserRepository()
  const trackRepository = new PrismaTracksRepository()
  const useCase = new ListTrackedTracksUseCase(trackRepository, userRepository)

  return useCase
}
