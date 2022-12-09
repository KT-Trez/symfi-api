import {EventEmitter} from 'events';
import express from 'express';
import fs from 'fs';
import WorkerService from '../services/WorkerService.js';
import validateRequestErrors from '../tools/validateRequestErrors';
import {Workers} from '../../typings/workers';
import {ApiErrorType} from '../../typings/enums';
import path from 'path';
import ApiError from '../classes/ApiError';


export default class contentController {
	private static cache = new Map<string, { path: string, timer: NodeJS.Timer }>();
	private static queue = new Map<string, NodeJS.EventEmitter>();

	//  todo: reimplement cache

	static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		const videoID = decodeURI(req.params.id);
		const streamRes = () => {
			const video = contentController.cache.get(videoID);
			fs.createReadStream(video.path).pipe(res);
		};

		if (contentController.cache.has(videoID))
			return streamRes();

		const mediaCacheDirPath = path.resolve('cache');
		const mediaPath = path.join(mediaCacheDirPath, `${videoID}.wav`);
		if (fs.existsSync(mediaPath)) {
			contentController.cache.set(videoID, {
				path: mediaCacheDirPath,
				timer: setTimeout(() => {
					contentController.cache.delete(videoID);
				}, 1000 * 60 * 60 * 24)
			});
			return streamRes();
		}

		if (contentController.queue.has(videoID))
			return contentController.queue.get(videoID).once('downloaded', streamRes);

		contentController.queue.set(videoID, new EventEmitter());

		try {
			const videoPath = await new Promise<string>((resolve, reject) => {
				const msgEventHandler = (msg: Workers.ParentPort.DownloadAudio) => {
					switch (msg.type) {
						case 'end':
							contentController.cache.set(videoID, {
								path: msg.path,
								timer: setTimeout(() => {
									contentController.cache.delete(videoID);
								}, 1000 * 60 * 60 * 24)
							});

							contentController.queue.get(videoID).emit('downloaded');
							contentController.queue.delete(videoID);

							resolve(msg.path);
							break;
						case 'error':
							reject(msg.error);
							break;
					}
				};

				WorkerService.queue.push({
					msgEventHandler: msgEventHandler,
					workerPath: './dist/src/workers/download-audio',
					workerData: {
						videoID
					}
				});

				WorkerService.startQueue();
			});

			fs.createReadStream(videoPath).pipe(res);
		} catch (err) {
			// todo: implement error status for incorrect id
			// msg 'Streaming data not available.'
			res.status(500).send(new ApiError(500, [err.message], ApiErrorType.InternalError));
		}
	}
}
