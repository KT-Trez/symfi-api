export class ApiError extends Error {
  errors?: string[];
  message: string;
  status: number;

  constructor(message: string, status: number, cause?: unknown, errors?: string[]) {
    super(message, { cause });
    this.errors = errors;
    this.message = message;
    this.status = status;
  }
}

export class ApiErrorV2 extends Error {
  http_status: number;
  message: string;
  reason: string;
  // noinspection JSUnusedGlobalSymbols
  success = false;

  constructor(http_status: number, message: string, reason: string, cause?: unknown) {
    super(message, { cause });
    this.http_status = http_status;
    this.message = message;
    this.reason = reason;
  }
}
