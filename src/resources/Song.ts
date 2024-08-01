// noinspection SuspiciousTypeOfGuard

import type { Channel, Duration, Song, Views } from '@types';
import { YTNodes } from 'youtubei.js';
import { exhaustiveCheck } from '../utils';

export type SongResourceCreatorArgs =
  | YTNodes.CompactVideo
  | YTNodes.GridVideo
  | YTNodes.PlaylistVideo
  | YTNodes.Video;

export class SongResource implements Song {
  channel!: Channel;
  duration!: Duration;
  id!: string;
  name!: string;
  published!: string;
  thumbnail!: string;
  views!: Views;

  constructor(video: SongResourceCreatorArgs) {
    if (video instanceof YTNodes.CompactVideo) {
      this.#fromCompactVideoOrVideo(video);
      return;
    }
    if (video instanceof YTNodes.GridVideo) {
      this.#fromGridVideo(video);
      return;
    }
    if (video instanceof YTNodes.PlaylistVideo) {
      this.#fromPlaylistVideo(video);
      return;
    }
    if (video instanceof YTNodes.Video) {
      this.#fromCompactVideoOrVideo(video);
      return;
    }

    exhaustiveCheck(video);
  }

  static isValue(value: unknown): value is SongResourceCreatorArgs {
    return (
      value instanceof YTNodes.CompactVideo ||
      value instanceof YTNodes.GridVideo ||
      value instanceof YTNodes.PlaylistVideo ||
      value instanceof YTNodes.Video
    );
  }

  #fromCompactVideoOrVideo(video: YTNodes.CompactVideo | YTNodes.Video) {
    const thumbnail =
      video.best_thumbnail?.url ||
      video.thumbnails.at(0)?.url ||
      this.#getPlaceholder(video.title.toString());
    const views = video.view_count
      .toString()
      .replace(/,/g, '')
      .split(' ')
      .at(0);

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
    this.thumbnail = thumbnail;
    this.views = {
      count: Number.parseInt(views || '0'),
      label: video.short_view_count.toString(),
    };
  }

  #fromGridVideo(video: YTNodes.GridVideo) {
    const thumbnail =
      video.thumbnails.at(0)?.url ||
      this.#getPlaceholder(video.title.toString());
    const views = video.views.toString().replace(/,/g, '').split(' ').at(0);

    this.channel = {
      name: video.author.name,
      url: video.author.url,
    };
    this.duration = {
      label: video.duration?.toString() || '',
      seconds: Number.parseInt(video.duration?.toString() || '0'),
    };
    this.id = video.id;
    this.name = video.title.toString();
    this.published = video.published.toString();
    this.thumbnail = thumbnail;
    this.views = {
      count: Number.parseInt(views || '0'),
      label: video.short_view_count.toString(),
    };
  }

  #fromPlaylistVideo(video: YTNodes.PlaylistVideo) {
    const thumbnail =
      video.thumbnails.at(0)?.url ||
      this.#getPlaceholder(video.title.toString());

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
    this.published = '[N/A]';
    this.thumbnail = thumbnail;
    this.views = {
      count: 0,
      label: '[N/A]',
    };
  }

  #getPlaceholder(text: string): string {
    return `http://placehold.co/1920x1080/5B93A0/fff?font=roboto&text=${text}`;
  }
}
