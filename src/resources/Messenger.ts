/* eslint-disable no-console */
import { EventEmitter } from 'events';

export const SEVERITY_CONST = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
} as const;

export type SEVERITY = (typeof SEVERITY_CONST)[keyof typeof SEVERITY_CONST];

const CONSOLE_COLORS: Record<SEVERITY, string> = {
  [SEVERITY_CONST.INFO]: '\u001b[36m',
  [SEVERITY_CONST.ERROR]: '\u001b[31m',
  [SEVERITY_CONST.SUCCESS]: '\u001b[32m',
  [SEVERITY_CONST.WARNING]: '\u001b[33m',
};

const LONGEST_LABEL_LENGTH = 7;

export class Messenger extends EventEmitter {
  message(severity: SEVERITY, text: string, noEmit?: boolean) {
    const message = `${this.#formatStdOut(severity)} ${text}`;

    switch (severity) {
      case 'ERROR':
        console.error(message);
        break;
      default:
        console.log(message);
    }

    if (!noEmit) {
      this.emit('message', severity, text);
    }
  }

  #formatStdOut(severity: SEVERITY) {
    const timestamp = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      fractionalSecondDigits: 3,
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      year: 'numeric',
    })
      .format(new Date())
      .split(', ');

    const padding = ''.padEnd(LONGEST_LABEL_LENGTH - severity.length, ' ');

    return `${timestamp[1]} | ${timestamp[0]}${padding} [${CONSOLE_COLORS[severity]}${severity}\u001b[0m]`;
  }
}
