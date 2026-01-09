export class TrackNotFoundError extends Error {
  constructor() {
    super('Track not found')
  }
}
