import express from 'express';
import validateRequestErrors from '../tools/validateRequestErrors';
import APIError from '../classes/ApiError';
import {ApiErrorType} from '../../typings/enums';


export default class mediaController {
	static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		const id = req.params.id;
		try {
			return res.status(200).json({link: `${req.protocol}://${req.get('host')}/v2/content/youtube/${id}`});
		} catch (e) {
			return res.status(404).json(new APIError(404, ['no such resource'], ApiErrorType.NoResource));
		}
	}
}
