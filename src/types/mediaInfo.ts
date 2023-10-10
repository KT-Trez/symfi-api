export type MediaInfo = {
  channel: {
    id: string;
    name: string;
    url: string;
  };
  description: string;
  id: string;
  metadata: {
    duration: {
      label: string;
      seconds: number;
    };
    published: string;
    thumbnails: Thumbnail[];
    views: {
      count: number;
      label: string;
    };
  };
  title: string;
};

export type Thumbnail = {
  height: number;
  url: string;
  width: number;
};
