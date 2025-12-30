export class RefreshTokenExpiredError extends Error {
  constructor() {
    super('Token expired')
  }
}
