// todo: refactor LOG_LEVEL
export enum LogLevel {
	NONE,
	WARNING,
	ERROR,
	INFO,
	DEBUG
}

export enum APIErrorType {
	InternalError = 'INTERNAL_ERROR',
	InvalidRequest = 'INVALID_REQUEST',
	NoResource = 'NO_RESOURCE'
}