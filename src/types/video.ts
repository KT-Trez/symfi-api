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

export type Text = {
  isEmpty(): boolean;
  text?: string;
  toHTML(): string | undefined;
  toString(): string;
};

export type Thumbnail = {
  height: number;
  url: string;
  width: number;
};
