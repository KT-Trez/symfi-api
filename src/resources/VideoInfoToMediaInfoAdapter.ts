import { MediaInfo, Thumbnail } from '../types/mediaInfo';
import { VideoInfo } from '../types/video';
import { ApiError } from './ApiError';

export class VideoInfoToMediaInfoAdapter implements MediaInfo {
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

  constructor(video: VideoInfo) {
    if (!video.basic_info.id || !video.basic_info.duration) {
      throw new ApiError('video data is incorrect', 502);
    }

    this.channel = {
      id: video.basic_info.channel?.id ?? '[NO INFORMATION]',
      name: video.basic_info.channel?.id ?? '[NO INFORMATION]',
      url: video.basic_info.channel?.url ?? '[NO INFORMATION]',
    };
    this.description = '[NOT SUPPORTED]';
    this.id = video.basic_info.id;
    this.metadata = {
      duration: {
        label: video.basic_info.duration.toString(),
        seconds: video.basic_info.duration,
      },
      published: '[NO INFORMATION]',
      thumbnails: video.basic_info.thumbnail ?? [
        {
          height: 576,
          url: 'https://placehold.co/1024x576/f44336/ffcdd2?font=roboto&text=No+Image',
          width: 1024,
        },
      ],
      views: {
        count: video.basic_info.view_count ?? 0,
        label: video.basic_info.view_count?.toString() ?? '[NO INFORMATION]',
      },
    };
    this.title = video.basic_info.title ?? '[NO INFORMATION]';
  }
}
