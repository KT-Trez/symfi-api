/* eslint-disable no-console */
export const LOG_LEVEL_CONST = {
  DEBUG: 'DEBUG',
  ERROR: 'ERROR',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
} as const;

export type LOG_LEVEL = (typeof LOG_LEVEL_CONST)[keyof typeof LOG_LEVEL_CONST];

export class Logger {
  static labels: Record<LOG_LEVEL, string> = {
    DEBUG: 'DEBUG',
    ERROR: 'ERROR',
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
  };

  static labelsLength: number = 7;

  static palette: Record<LOG_LEVEL, string> = {
    DEBUG: '\u001b[30;1m',
    ERROR: '\u001b[31;1m',
    INFO: '\u001b[36;1m',
    SUCCESS: '\u001b[32;1m',
    WARNING: '\u001b[33;1m',
  };

  color(message: string, severity: LOG_LEVEL) {
    return `${Logger.palette[severity]}${message}\u001b[0m`;
  }

  log(message: string, options: LOG_LEVEL = LOG_LEVEL_CONST.INFO): void {
    const timestamp = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      fractionalSecondDigits: 3,
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      year: 'numeric',
    }).format(new Date());
    const pad = ''.padEnd(Logger.labelsLength - Logger.labels[options].length, ' ');
    const severity = this.color(Logger.labels[options], options);

    switch (options) {
      case LOG_LEVEL_CONST.DEBUG:
        console.debug(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LOG_LEVEL_CONST.ERROR:
        console.error(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LOG_LEVEL_CONST.INFO:
        console.info(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LOG_LEVEL_CONST.SUCCESS:
        console.info(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LOG_LEVEL_CONST.WARNING:
        console.warn(`${timestamp}${pad} [${severity}] ${message}`);
        break;
    }
  }
}
