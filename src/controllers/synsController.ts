import express from 'express';
import {Musicly} from '../../typings/index.js';
import APISync from '../classes/APISync.js';
import SyncService from '../services/SyncService.js';
import handleRequestValidationErrors from '../tools/handleRequestValidationErrors.js';
import PlaylistMetadata = Musicly.PlaylistMetadata;
import SavedSongMetadata = Musicly.SavedSongMetadata;


export default class syncController {
	public static handleGet(req: express.Request, res: express.Response) {
		if (handleRequestValidationErrors(req, res))
			return;

		const uid = parseInt(req.params.uid);
		res.json(SyncService.get(uid));
	}

	public static handlePost(req: express.Request, res: express.Response) {
		if (handleRequestValidationErrors(req, res))
			return;

		const playLists: PlaylistMetadata[] = req.body.playLists;
		const songsList: SavedSongMetadata[] = req.body.songsList;

		const uid = SyncService.set(playLists, songsList);
		res.status(200).json(new APISync(true, uid));
	}
}