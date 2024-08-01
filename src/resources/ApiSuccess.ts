export class ApiSuccess {
  // noinspection JSUnusedGlobalSymbols
  http_status = 200;
  message: string;
  meta?: string;
  // noinspection JSUnusedGlobalSymbols
  success = true;

  constructor(message: string, meta?: string) {
    this.message = message;
    this.meta = meta;
  }
}
