import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache, YTNodes } from 'youtubei.js';
import { ApiError } from '../../resources/ApiError.ts';
import { VideoToMediaInfoAdapter } from '../../resources/VideoToMediaInfoAdapter.ts';
import type { MediaInfo } from '../../types/mediaInfo.ts';

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
    cache: new UniversalCache(true),
  });

  console.log(query);

  try {
    const search = await youtube.search(query, {
      sort_by: 'relevance',
      type: 'video',
    });

    if (search.videos.length <= 0) {
      return next(new ApiError('no such resource', 404));
    }

    const data: MediaInfo[] = search.videos
      .filter(video => video instanceof YTNodes.Video)
      .map(video => new VideoToMediaInfoAdapter(video));

    res.status(200).json(data);
  } catch (err) {
    next(new ApiError('failed to search for song', 502, err));
  }
};

export const searchController = {
  searchThroughYouTube,
};
