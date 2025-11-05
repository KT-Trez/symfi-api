import type { YTNodes } from 'youtubei.js';
import type { MediaInfo, Thumbnail } from '../types/mediaInfo.ts';

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

  constructor(video: YTNodes.Video) {
    this.channel = {
      id: video.author.id,
      name: video.author.name,
      url: video.author.url,
    };
    this.description = '[NOT SUPPORTED]';
    this.id = video.id;
    this.metadata = {
      duration: {
        label: video.duration.text?.toString() ?? '[N / A]',
        seconds: video.duration.seconds,
      },
      published: video.published?.toString() ?? '[N / A]',
      thumbnails: video.thumbnails,
      views: {
        count: video.view_count ? Number.parseInt(video.view_count.toString(), 10) : 0,
        label: video.short_view_count?.toString() ?? '[N / A]',
      },
    };
    this.title = video.title.toString();
  }
}
