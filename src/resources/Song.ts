import type { Channel, Duration, Song, Video, Views } from '@types';

export class SongResource implements Song {
  channel: Channel;
  duration: Duration;
  id: string;
  name: string;
  published: string;
  thumbnail: string | null;
  views: Views;

  constructor(video: Video) {
    this.channel = {
      name: video.author.name,
      url: video.author.url,
    };
    this.duration = {
      label: video.duration.text,
      seconds: video.duration.seconds,
    };
    this.id = video.id;
    this.name = video.title.toString();
    this.published = video.published.toString();
    this.thumbnail = video.best_thumbnail?.url || video.thumbnails.at(0)?.url || null;
    this.views = {
      count: parseInt(video.view_count.toString()),
      label: video.short_view_count.toString(),
    };
  }
}
