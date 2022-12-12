import {Lib} from '../../typings';


interface MediaInfoConstructor extends Lib.MediaInfo {
}

export default class MediaInfo implements Lib.MediaInfo {
	public channel: { id: string; name: string; url: string };
	public description: string;
	public id: string;
	public metadata: { duration: { label: string; seconds: number }; published: string; thumbnails: Lib.Thumbnail[]; views: { count: number; label: string } };
	public title: string;

	constructor(options: MediaInfoConstructor) {
		this.channel = options.channel;
		this.description = options.description;
		this.id = options.id;
		this.metadata = options.metadata;
		this.title = options.title;
	}
}
