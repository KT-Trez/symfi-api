import {MediaInfo as IMediaInfo} from '../../gen/model/mediaInfo';


export default class MediaInfo implements IMediaInfo {
	public channel: IMediaInfo['channel'];
	public description: string;
	public id: string;
	public metadata: IMediaInfo['metadata'];
	public title: string;

	constructor(options: IMediaInfo) {
		this.channel = options.channel;
		this.description = options.description;
		this.id = options.id;
		this.metadata = options.metadata;
		this.title = options.title;
	}
}
