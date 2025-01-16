export class FetchError extends Error {
  constructor(message: string) {
    super(`Error fetching website data: ${message}`);
  }
}
