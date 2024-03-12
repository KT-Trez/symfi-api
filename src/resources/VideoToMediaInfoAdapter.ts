import type { MediaInfo, Thumbnail, Video } from '@types';

export class VideoToMediaInfoAdapter implements MediaInfo {
  public channel: { id: string; name: string; url: string };
  public description: string;
  public id: string;
  public metadata: {
    duration: { label: string; seconds: number };
    published: string;
    thumbnails: Thumbnail[];
    views: { count: number; label: string };
  };
  public title: string;

  constructor(video: Video) {
    this.channel = {
      id: video.author.id,
      name: video.author.name,
      url: video.author.url,
    };
    this.description = '[NOT SUPPORTED]';
    this.id = video.id;
    this.metadata = {
      duration: {
        label: video.duration.text,
        seconds: video.duration.seconds,
      },
      published: video.published.toString(),
      thumbnails: video.thumbnails,
      views: {
        count: parseInt(video.view_count.toString()),
        label: video.short_view_count.toString(),
      },
    };
    this.title = video.title.toString();
  }
}
