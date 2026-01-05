export class ArtistNotFoundError extends Error {
  constructor() {
    super('Artist not found')
  }
}
