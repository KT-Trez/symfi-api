import express from 'express';
import {ValidationError, validationResult} from 'express-validator';
import ApiError from '../classes/ApiError';
import {ApiError as IApiError} from '../../gen/model/apiError';


export default function validateRequestErrors(req: express.Request, res: express.Response) {
	// important: todo: refactor to better handle errors
	const errorFormatter = ({location, msg, param}: ValidationError) => {
		return `invalid ${location} | param <${param}>: ${msg}`;
	};
	const errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		res.status(400).json(new ApiError(400, errors.array(), IApiError.TypeEnum.NoResource));
		return true;
	}
	return false;
}
