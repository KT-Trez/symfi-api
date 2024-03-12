export class ApiSuccess {
  // noinspection JSUnusedGlobalSymbols
  http_status = 200;
  message: string;
  // noinspection JSUnusedGlobalSymbols
  success = true;

  constructor(message: string) {
    this.message = message;
  }
}
