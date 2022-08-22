import express from 'express';
import fs from 'fs';
import Innertube from 'youtubei.js';
import {LogLevel} from '../../typings/enums.js';
import APIError from '../classes/APIError.js';
import handleRequestValidationErrors from '../tools/handleRequestValidationErrors.js';


export default class downloadController {
	static cache = new Map();

	static async soundCloud() {
	}

	static async youtube(req: express.Request, res: express.Response) {
		if (handleRequestValidationErrors(req, res))
			return;

		const youtube = await new Innertube();
		const videoID = decodeURI(req.query.audioID.toString());

		if (downloadController.cache.has(videoID)) {
			const video = downloadController.cache.get(videoID);
			return fs.createReadStream(video.path).pipe(res);
		}

		const stream = youtube.download(videoID, {
			format: 'webm',
			type: 'audio'
		});

		const videoPath = `./cache/${videoID}.wav`
		stream.pipe(fs.createWriteStream(videoPath));

		try {
			await new Promise<void>((resolve, reject) => {
				stream
					.on('end', () => {
						downloadController.cache.set(videoID, {
							timer: setTimeout(() => {
								downloadController.cache.delete(videoID);
							}, 1000 * 60 * 60 * 24),
							path: videoPath
						});

						resolve();

						if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
							console.info('downloaded video: ' + videoID, new Date());
					})
					.on('error', (err) => {
						reject(err);

						if (parseInt(process.env.LOG_LEVEL) > LogLevel.WARNING)
							console.error('downloading video ended with error: ', err, new Date());
					})
					.on('info', (info) => {
						if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
							console.info('selected video | ' + info.video_details.title + '[' + info.video_details.metadata.channel_name + ']', new Date());
					})
					.on('progress', (info) => {
						if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
							console.info(videoID + 'progress | ' + info.downloaded_size + '/' + info.size + 'MB (' + info.percentage + ')%', new Date());
					})
					.on('start', () => {
						if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
							console.info('starting to download video: ' + videoID, new Date());
					});
			});

			fs.createReadStream(videoPath).pipe(res);
		} catch (err) {
			res.status(500).send(new APIError(500, [err.message], 'INTERNAL_ERROR'));
		}
	}
}