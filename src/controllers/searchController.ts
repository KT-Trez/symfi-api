import express from 'express';
import {Innertube, UniversalCache} from 'youtubei.js';
import validateRequestErrors from '../tools/validateRequestErrors';
import APIError from '../classes/ApiError';
import MediaInfo from '../classes/MediaInfo';
import Video from 'youtubei.js/dist/src/parser/classes/Video';
import {ApiErrorType} from '../../typings/enums';


export default class searchController {
	static async youtube(req: express.Request, res: express.Response) {
		if (validateRequestErrors(req, res))
			return;

		const query = decodeURI(req.query.query.toString());

		const youtube = await Innertube.create({
			cache: new UniversalCache()
		});
		const search = await youtube.search(query, {
			sort_by: 'relevance',
			type: 'video'
		});

		if (search.videos.length > 0)
			return res.status(200).json(
				search.videos.map((video: Video) => new MediaInfo({
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

		return res.status(404).json(new APIError(404, ['no such resource'], ApiErrorType.NoResource));
	}
}
