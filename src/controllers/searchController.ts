import express from 'express';
import {Innertube} from 'youtubei.js';
import Video from 'youtubei.js/dist/src/parser/classes/Video';
import {ApiErrorType} from '../../types/enums';
import ApiError from '../classes/ApiError';
import APIError from '../classes/ApiError';
import Logger, {LogLevel} from '../classes/Logger';
import MediaInfo from '../classes/MediaInfo';
import isRequestInvalid from '../tools/isRequestInvalid.js';


export default class searchController {
	static async youtube(req: express.Request, res: express.Response) {
		if (isRequestInvalid(req, res))
			return;

		const query = decodeURI(req.query.query.toString());

		const search = await (await Innertube.create()).search(query, {
			sort_by: 'relevance',
			type: 'video'
		});

		try {
			if (search.videos.length <= 0)
				return res.status(404).json(new APIError(404, ['no such resource'], ApiErrorType.NoResource));

			return res.status(200).json(
				search.videos.filter(v => v.type === 'Video').map((video: Video) => new MediaInfo({
						channel: {
							id: video.author.id,
							name: video.author.name,
							url: video.author.url
						},
						description: video.description,
						id: video.id,
						metadata: {
							duration: {
								label: video.duration.text,
								seconds: video.duration.seconds
							},
							published: video.published.text,
							thumbnails: video.thumbnails,
							views: {
								count: parseInt(video.view_count.text.split(' ')[0].replaceAll(',', '')),
								label: video.short_view_count.text
							}
						},
						title: video.title.text
					}))
			);
		} catch (err) {
			Logger.log(err.message, LogLevel.Warning);
			res.status(500).send(new ApiError(500, [err.message], ApiErrorType.InternalError));
		}
	}
}
