import express from 'express';
import {ValidationError, validationResult} from 'express-validator';
import {ApiErrorCode, ApiErrorType} from '../../typings/enums';
import ApiError from '../classes/ApiError';


function errorFormatter({location, msg, param}: ValidationError) {
	return `invalid ${location} | <${param}>: ${msg}`;
}

export default function isRequestInvalid(req: express.Request, res: express.Response) {
	const errors = validationResult(req);

	// todo: change errors array to error string
	if (!errors.isEmpty()) {
		const error = errors.array({onlyFirstError: true})[0];
		switch (error.location) {
			case 'body':
				res.status(400).json(new ApiError(ApiErrorCode.InvalidBody, [errorFormatter(error)], ApiErrorType.InvalidRequest));
				return true;
			case 'params':
				res.status(400).json(new ApiError(ApiErrorCode.InvalidPath, [errorFormatter(error)], ApiErrorType.InvalidRequest));
				return true;
			case 'query':
				res.status(400).json(new ApiError(ApiErrorCode.InvalidQuery, [errorFormatter(error)], ApiErrorType.InvalidRequest));
				return true;
			default:
				res.status(400).json(new ApiError(ApiErrorCode.UnknownError, [errorFormatter(error)], ApiErrorType.NoResource));
				return true;
		}
	}

	return false;
}
