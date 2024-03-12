import type { Channel, Duration, Song, Video, Views } from '@types';

export class SongResource implements Song {
  channel: Channel;
  duration: Duration;
  id: string;
  name: string;
  published: string;
  thumbnail: string;
  views: Views;

  constructor(video: Video) {
    const views = video.view_count.toString().replace(/,/g, '').split(' ').at(0);

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
    this.thumbnail =
      video.best_thumbnail?.url ||
      video.thumbnails.at(0)?.url ||
      `http://placehold.co/1920x1080/5B93A0/fff?font=roboto&text=${video.title}`;
    this.views = {
      count: parseInt(views || '0'),
      label: video.short_view_count.toString(),
    };
  }
}
