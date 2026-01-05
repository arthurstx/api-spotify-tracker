export class SnapshotNotFoundError extends Error {
  constructor() {
    super('Snapshot not found.')
  }
}
