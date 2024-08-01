import type { Thumbnail } from './mediaInfo';

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
