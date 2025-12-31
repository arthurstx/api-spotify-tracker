export class SyncAlreadyDoneError extends Error {
  constructor() {
    super('it should not able sync in same day')
  }
}
