import express from 'express';
import {Musicly} from '../../typings';
import SavedSongMetadata = Musicly.SavedSongMetadata;
import PlaylistMetadata = Musicly.PlaylistMetadata;


export default class shareController {
	static audio = new Map<string, SavedSongMetadata[]>();
	static playlists = new Map<string, PlaylistMetadata[]>();

	static getAudio(req: express.Request, res: express.Response) {

	}

	static postAudio(req: express.Request, res: express.Response) {

	}
}