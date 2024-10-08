import { ApiError, VideoToMediaInfoAdapter } from '@resources';
import type { MediaInfo } from '@types';
import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache } from 'youtubei.js';

const searchThroughYouTube = async (
  req: Request<
    Record<string, never>,
    MediaInfo[],
    undefined,
    {
      query: string;
    }
  >,
  res: Response<MediaInfo[]>,
  next: NextFunction,
) => {
  const query = decodeURI(req.query.query);

  const youtube = await Innertube.create({
    cache: new UniversalCache(false),
  });

  try {
    const search = await youtube.search(query, {
      sort_by: 'relevance',
      type: 'video',
    });

    if (search.videos.length <= 0) {
      return next(new ApiError('no such resource', 404));
    }

    const data: MediaInfo[] = search.videos
      .filter(video => video.type === 'Video')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map(video => new VideoToMediaInfoAdapter(video));

    res.status(200).json(data);
  } catch (err) {
    next(new ApiError('failed to search for song', 502, err));
  }
};

export const searchController = {
  searchThroughYouTube,
};
