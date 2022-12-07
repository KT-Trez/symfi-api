import express from 'express';
import {Innertube, UniversalCache} from 'youtubei.js';
import validateRequestErrors from '../tools/validateRequestErrors';
import APIError from '../classes/ApiError';
import {ApiError as IApiError} from '../../gen/model/apiError';


export default class mediaController {
	static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		const id = req.params.id;

		const youtube = await Innertube.create({
			cache: new UniversalCache()
		});

		try {
			const videoInfo = await youtube.getInfo(id);
			const audioLink = videoInfo.chooseFormat({
				type: 'audio',
				quality: 'best'
			});

			return res.status(200).json({link: audioLink.decipher(youtube.session.player)});
		} catch (e) {
			return res.status(404).json(new APIError(404, ['no such resource'], IApiError.TypeEnum.NoResource));
		}
	}
}
