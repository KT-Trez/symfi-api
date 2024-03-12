export class ApiSuccess {
  // noinspection JSUnusedGlobalSymbols
  http_status = 200;
  // noinspection JSUnusedGlobalSymbols
  success = true;
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
