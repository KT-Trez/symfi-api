import express from 'express';
import {Innertube, UniversalCache} from 'youtubei.js';
import {ApiErrorType} from '../../typings/enums';
import ApiError from '../classes/ApiError';
import Server from '../classes/Server.js';
import validateRequestErrors from '../tools/validateRequestErrors';


export default class mediaController {
	static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		// the media's id
		const id = req.params.id;

		// redirect request to the local endpoint that streams audio
		if (Server.instance.config.download.useProxy)
			return res.status(200).json({link: `${req.protocol}://${req.get('host')}/v2/content/youtube/${id}`});

		// search instance of the YouTube's API
		const youtube = await Innertube.create({
			cache: new UniversalCache()
		});

		// find external media stream, extract and send its link to the client
		try {
			const videoInfo = await youtube.getInfo(id);
			const audioLink = videoInfo.chooseFormat({
				type: 'audio',
				quality: 'best'
			});

			return res.status(200).json({link: audioLink.decipher(youtube.session.player)});
		} catch (e) {
			return res.status(404).json(new ApiError(404, ['no such resource'], ApiErrorType.NoResource));
		}
	}
}
