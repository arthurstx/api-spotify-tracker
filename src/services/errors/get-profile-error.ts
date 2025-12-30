export class GetProfileError extends Error {
  constructor() {
    super('Failed to fetch Spotify profile')
  }
}
