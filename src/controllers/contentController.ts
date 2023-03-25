import {EventEmitter} from 'events';
import express from 'express';
import fs from 'fs';
import path from 'path';
import {Innertube} from 'youtubei.js';
import {ApiErrorType} from '../../typings/enums';
import {Workers} from '../../typings/workers';
import ApiError from '../classes/ApiError';
import Logger, {LogLevel} from '../classes/Logger';
import MediaInfo from '../classes/MediaInfo';
import Server from '../classes/Server.js';
import DownloadManager from '../services/DownloadManager.js';
import Time from '../tools/Time';
import validateRequestErrors from '../tools/validateRequestErrors';


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
	public static async check(req: express.Request, res: express.Response) {
		const ids = req.body;

		const resJSON = [];

		try {
			for (const id of ids) {
				// todo: introduce single Innertube instance
				const video = await (await Innertube.create()).getInfo(id).catch(err => {
					if (err && err.message !== 'InnertubeError: This video is unavailable')
						console.error(err);
				});

				if (video)
					resJSON.push(new MediaInfo({
						channel: {
							id: video.basic_info.channel.id,
							name: video.basic_info.channel.name,
							url: video.basic_info.channel.url
						},
						description: video.basic_info.short_description,
						id: video.basic_info.id,
						metadata: {
							duration: {
								label: Time.createTimestamp(video.basic_info.duration, 'seconds'),
								seconds: video.basic_info.duration
							},
							published: video.primary_info.published.text,
							thumbnails: [video.basic_info.thumbnail[0]],
							views: {
								count: video.basic_info.view_count,
								label: video.primary_info.short_view_count.text
							}
						},
						title: video.basic_info.title
					}));
			}

			res.status(200).json(resJSON);
		} catch (err) {
			Logger.log(err.message, LogLevel.Warning);
			res.status(500).send(new ApiError(500, [err.message], ApiErrorType.InternalError));
		}
	}

	public static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		// get media id and path to resource if it's cached
		const mediaID = decodeURI(req.params.id);
		const cachedPath = Server.instance.cache.getSync(mediaID);

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
					Server.instance.cache.set(mediaID, message.path);
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
			DownloadManager.addToQueue({videoID: mediaID}, path.resolve(__dirname, '../workers/download-audio.js'), onMessage);
		} catch (err) {
			Logger.log(err.message, LogLevel.Warning);
			res.status(500).send(new ApiError(500, [err.message], ApiErrorType.InternalError));
		}
	}
}
