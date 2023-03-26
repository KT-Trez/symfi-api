export enum ApiErrorCode {
	InvalidBody,
	InvalidPath,
	InvalidQuery,
	NoResource,
	UnknownError
}

export enum ApiErrorType {
	InternalError = 'INTERNAL_ERROR',
	InvalidRequest = 'INVALID_REQUEST',
	NoResource = 'NO_RESOURCE'
}

// todo: refactor LOG_LEVEL
export enum LogLevel {
	NONE,
	WARNING,
	ERROR,
	INFO,
	DEBUG
}
