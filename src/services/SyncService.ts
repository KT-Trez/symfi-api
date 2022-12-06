import {Musicly} from '../../typings';
import config from '../config.js';
import PlaylistMetadata = Musicly.PlaylistMetadata;
import SavedSongMetadata = Musicly.SavedSongMetadata;
import SyncEntry = Musicly.SyncEntry;


export default class SyncService {
	private static store = new Map<number, SyncEntry>();

	private static highestID = 0;
	private static lowestFreeID: number[] = [];

	static clear() {
		this.store.clear();
	}

	static get(id: number) {
		if (!this.store.has(id))
			throw new Error('incorrect id of store item');

		const data = this.store.get(id);
		return {
			playLists: data.playLists,
			songsList: data.songsList
		};
	}

	static getSize() {
		return this.store.size;
	}

	static has(id: number) {
		return this.store.has(id);
	}

	static remove(id: number) {
		clearTimeout(this.store.get(id).timer);
		this.store.delete(id);
		this.removeID(id);
	}

	static set(playLists: PlaylistMetadata[], songsList: SavedSongMetadata[]) {
		const id = this.generateID();
		const removeTimeout = setTimeout(() => this.remove(id), config.sync.storeTimeoutMS);

		this.store.set(id, {
			playLists,
			songsList,
			timer: removeTimeout
		});

		return this.beautifyID(id);
	}

	private static beautifyID(id: number) {
		let beautifiedID = '';
		for (let i = 0; i < config.sync.IDLength - id.toString().length; i++)
			beautifiedID += '0';
		return beautifiedID + id;
	}

	private static generateID() {
		if (this.lowestFreeID.length !== 0)
			return this.lowestFreeID.shift();
		this.highestID++;
		return this.highestID;
	}

	private static removeID(id: number) {
		if (id < this.highestID)
			this.lowestFreeID.push(id);
		else if (id === this.highestID)
			this.highestID--;
	}
}