import {EventEmitter} from 'events';
import express from 'express';
import fs from 'fs';
import WorkerService from '../services/WorkerService.js';
import validateRequestErrors from '../tools/validateRequestErrors';
import {Workers} from '../../typings/workers';
import {ApiErrorType} from '../../typings/enums';
import ApiError from '../classes/ApiError';
import {cache} from '../server.js';
import Logger, {LogLevel} from '../classes/Logger';


class Queue {
	/**
	 * Map containing all queued items.
	 */
	public static readonly map = new Map<string, Queue>();

	/**
	 * Sends event to all queued items, notifying that media has been downloaded and is ready to be streamed to clients.
	 * Removes
	 * @param id - The resource id
	 */
	public static announceResourceAvailable(id: string) {
		if (!this.map.has(id))
			return;

		this.map.get(id).eventEmitter.emit('resource:ready');
		this.map.delete(id);
	}

	/**
	 * Adds new item to queue.
	 * Item's handler will be executed once media with specified id will finish downloading.
	 * @param id - the id of the media.
	 * @param handler - handler that will be executed.
	 */
	public static waitToStreamResource(id: string, handler: () => void) {
		this.map.get(id).subscribe(handler);
	}

	// instance
	private readonly eventEmitter = new EventEmitter();
	private readonly id: string;

	constructor(id: string) {
		this.id = id;
		Queue.map.set(this.id, this);
	}

	/**
	 * Executes handler, after media with this item's id will finish downloading.
	 * @param handler - the handler to execute,
	 */
	subscribe(handler: () => void) {
		this.eventEmitter.once('resource:ready', handler);
	}
}

export default class contentController {
	public static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		// get media id and path to resource if it's cached
		const mediaID = decodeURI(req.params.id);
		const cachedPath = cache.getSync(mediaID);

		// function that streams media resource to client
		const streamAudio = () => fs.createReadStream(cachedPath).pipe(res);

		// if resource was already downloaded (path to resource was cached), stream downloaded resource
		if (cachedPath)
			return streamAudio();

		// if media is being downloaded, push response with streaming handler to queue, and wait for the end of the download
		if (Queue.map.has(mediaID))
			return Queue.waitToStreamResource(mediaID, streamAudio);

		// 'message' event handler of download worker
		const onMessage = (message: Workers.ParentPort.DownloadAudio) => {
			switch (message.type) {
				case 'end':
					cache.set(mediaID, message.path);
					Queue.announceResourceAvailable(mediaID);
					fs.createReadStream(message.path).pipe(res);
					break;
				case 'error':
					res.status(500).send(new ApiError(500, [message.error.message], ApiErrorType.InternalError));
					break;
			}
		};
		try {
			// push new download worker to workers queue
			WorkerService.addToQueue({videoID: mediaID}, './dist/src/workers/download-audio', onMessage);
		} catch (err) {
			Logger.log(err.message, LogLevel.Warning);
			res.status(500).send(new ApiError(500, [err.message], ApiErrorType.InternalError));
		}
	}
}
