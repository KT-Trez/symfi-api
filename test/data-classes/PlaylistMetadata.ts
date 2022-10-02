import {Musicly} from '../../typings';


export default class PlaylistMetadata implements Musicly.PlaylistMetadata {
	constructor() {
		this.randomize();
	}

	cover: { name: string; uri: string; };
    flags: {
        hasCover: boolean;
    };
	id: string;
	name: string;
    order: number;
    songsCount: number;

	deleteRandomProperties(quantity: number) {
		const randomProperty = () => {
			const keys = Object.keys(this); //@ts-ignore
			return this[keys[ keys.length * Math.random() << 0]];
		};
		for (let i = 0; i < quantity; i++)//@ts-ignore
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
		this.cover = {
				name: this.generateString(6),
				uri: this.generateString(12)
		};
		this.flags = {
			hasCover: Math.random() < 0.5
		};
		this.id = new Date().getMilliseconds().toString();
		this.name = this.generateString(6);
		this.order = Math.floor(Math.random() * 1000);
		this.songsCount = Math.floor(Math.random() * 1000);
	}
}