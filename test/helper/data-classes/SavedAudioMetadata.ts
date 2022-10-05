import {Musicly} from '../../../typings/index.js';


export default class SavedAudioMetadata implements Musicly.SavedSongMetadata {
	constructor() {
		this.randomize();
	}

	channel: { id: string; name: string; url: string; };
	musicly: { cover: { color: string; name: string; uri: string; }; file: { path: string; size: number; }; flags: { hasCover: boolean; isDownloaded: boolean; isFavourite: boolean; }; playlists: Musicly.PlaylistData[]; wasPlayed: number; };
	description: string;
	id: string;
	metadata: any;
	title: string;
	url: string;

	deleteRandomProperties(quantity: number) {
		const randomProperty = () => {
			const keys = Object.keys(this); //@ts-ignore
			return this[keys[ keys.length * Math.random() << 0]];
		};
		for (let i = 0; i < quantity; i++) //@ts-ignore
			delete randomProperty();

		return this;
	}

	private generateString(length: number) {
		let result = '';
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charsLength = chars.length;
		for (let i = 0; i < length; i++)
			result += chars.charAt(Math.floor(Math.random() * charsLength));
		return result;
	}

	private randomize() {
		this.channel = {
			id: this.generateString(9),
			name: this.generateString(6),
			url: this.generateString(12)
		};
		this.description = this.generateString(24);
		this.id = new Date().getMilliseconds().toString();
		this.metadata = 'metadata';
		this.musicly = {
			cover: {
				color: Math.floor(Math.random() * 16777215).toString(16),
				name: this.generateString(6),
				uri: this.generateString(12)
			},
			file: {
				path: this.generateString(9),
				size: Math.floor(Math.random() * 1000000)
			},
			flags: {
				hasCover: Math.random() < 0.5,
				isDownloaded: Math.random() < 0.5,
				isFavourite: Math.random() < 0.5,
			},
			playlists: [],
			wasPlayed: 0
		};
		this.title = this.generateString(6);
		this.url = this.generateString(12);
	}
}