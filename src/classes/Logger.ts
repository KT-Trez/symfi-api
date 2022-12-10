import moment from 'moment';


export enum LogLevel {
	Info,
	Error,
	Success,
	Warning,
}

export default class Logger {
	private static _maxLabelLength: number;
	private static colors = new Map<LogLevel, { bg: string, fg: string }>([
		[LogLevel.Info, {bg: '\u001b[46;1m', fg: '\u001b[36m'}],
		[LogLevel.Error, {bg: '\u001b[41;1m', fg: '\u001b[31m'}],
		[LogLevel.Success, {bg: '\u001b[42;1m', fg: '\u001b[32m'}],
		[LogLevel.Warning, {bg: '\u001b[43;1m', fg: '\u001b[33m'}]
	]);

	private static labels = new Map<LogLevel, string>([
		[LogLevel.Info, 'info'],
		[LogLevel.Error, 'error'],
		[LogLevel.Success, 'success'],
		[LogLevel.Warning, 'warning']
	]);

	private static get maxLabelLength() {
		if (this._maxLabelLength)
			return this._maxLabelLength;

		for (const label of Logger.labels.values())
			if (label.length > (this._maxLabelLength ?? 0))
				this._maxLabelLength = label.length;

		return this._maxLabelLength;
	};

	public static insertSpaces(label: string) {
		let string = '';
		for (let i = 0; i < this.maxLabelLength - label.length; i++)
			string += ' ';

		return string;
	}

	public static log(message: string, level: LogLevel = LogLevel.Info, format: string = 'HH:mm:ss • MM/DD/YYYY', color?: LogLevel) {
		if (level <= (parseInt(process.env.LOG_LEVEL) ?? 0))
			console.log(`${moment().format(format)} ${this.insertSpaces(this.labels.get(level))}[${color ?? this.colors.get(level).fg}${this.labels.get(level).toUpperCase()}\u001b[0m] ${message}`);
	}
}
