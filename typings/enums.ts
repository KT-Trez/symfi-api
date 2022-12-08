// todo: refactor LOG_LEVEL
export enum ApiErrorType {
	InternalError = 'INTERNAL_ERROR',
	InvalidRequest = 'INVALID_REQUEST',
	NoResource = 'NO_RESOURCE'
}

export enum LogLevel {
	NONE,
	WARNING,
	ERROR,
	INFO,
	DEBUG
}
