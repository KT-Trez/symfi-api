import type { Thumbnail } from './mediaInfo';

export type Text = {
  isEmpty(): boolean;
  text?: string;
  toHTML(): string | undefined;
  toString(): string;
};

export type Video = {
  author: {
    get best_thumbnail(): Thumbnail | undefined;
    id: string;
    is_moderator?: boolean;
    is_verified?: boolean;
    is_verified_artist?: boolean;
    name: string;
    thumbnails: Thumbnail[];
    url: string;
  };
  get best_thumbnail(): Thumbnail | undefined;
  duration: {
    seconds: number;
    text: string;
  };
  id: string;
  published: Text;
  short_view_count: Text;
  title: Text;
  thumbnails: Thumbnail[];
  view_count: Text;
};

export type VideoInfo = {
  basic_info: {
    channel: {
      id: string;
      name: string;
      url: string;
    } | null;
    duration?: number | undefined;
    id?: string | undefined;
    thumbnail?: Thumbnail[];
    title?: string | undefined;
    view_count: number | undefined;
  };
};
