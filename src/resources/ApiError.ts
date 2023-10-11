export class ApiError extends Error {
  errors?: string[];
  message: string;
  status: number;

  constructor(
    message: string,
    status: number,
    cause?: unknown,
    errors?: string[],
  ) {
    super(message, { cause });
    this.errors = errors;
    this.message = message;
    this.status = status;
  }
}
