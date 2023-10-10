export class ApiError extends Error {
  message: string;
  status: number;

  constructor(message: string, status: number, cause?: unknown) {
    super(message, { cause });
    this.status = status;
    this.message = message;
  }
}
