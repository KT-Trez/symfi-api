export type SongId = string;

export type Song = {
  channel: Channel;
  duration: Duration;
  id: SongId;
  name: string;
  published: string;
  thumbnail: string;
  views: Views;
};

export type Channel = {
  name: string;
  url: string;
};

export type Duration = {
  label: string;
  seconds: number;
};

export type Views = {
  count: number;
  label: string;
};
