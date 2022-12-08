import {Musicly} from '../../typings';


interface MediaInfoConstructor extends Musicly.MediaInfo {
}

export default class MediaInfo implements Musicly.MediaInfo {
	public channel: { id: string; name: string; url: string };
	public description: string;
	public id: string;
	public metadata: { duration: { label: string; seconds: number }; published: string };
	public title: string;

	constructor(options: MediaInfoConstructor) {
		this.channel = options.channel;
		this.description = options.description;
		this.id = options.id;
		this.metadata = options.metadata;
		this.title = options.title;
	}
}
