import { ApiErrorV2, ApiSuccess, CollectionFormatResource, SongResource } from '@resources';
import type { CollectionFormat, NoBody, NoParams, Song } from '@types';
import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache } from 'youtubei.js';

const download = async (
  req: Request<NoParams, NoBody, ApiSuccess, { id: string }>,
  res: Response<ApiSuccess>,
  next: NextFunction,
) => {
  const id = req.query.id;

  try {
    // search instance of the YouTube's API
    const youtube = await Innertube.create({
      cache: new UniversalCache(true),
    });

    const info = await youtube.getBasicInfo(id);

    // redirect request to the local endpoint that streams audio
    if (process.env.PROXY_DOWNLOAD_ENABLED) {
      res.status(200).json(new ApiSuccess('Video found', `${req.protocol}://${req.get('host')}/v3/song/${id}`));
      return;
    }

    const format = info.chooseFormat({
      type: 'audio',
      quality: 'best',
    });

    res.status(200).json(new ApiSuccess('Video found', format.decipher(youtube.session.player)));
  } catch (err) {
    // check if the error is due to the video being unavailable
    if (err instanceof Error && /this video is unavailable/i.test(err.message)) {
      next(new ApiErrorV2(404, 'Not Found', 'the requested video was not found'));
      return;
    }
    next(new ApiErrorV2(502, 'Bad Gateway', 'cannot connect to YouTube servers at the moment', err));
  }
};

const search = async (
  req: Request<never, CollectionFormat<Song>, undefined, { page?: string; q: string }>,
  res: Response<CollectionFormat<Song>>,
  next: NextFunction,
) => {
  const page = Number(req.query.page); // todo: implement pagination
  const searchQuery = decodeURI(req.query.q);

  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
  });

  try {
    const search = await youtube.search(searchQuery, {
      sort_by: 'relevance',
      type: 'video',
    });

    if (search.videos.length <= 0) {
      return next(new ApiErrorV2(404, 'No resource', 'found no videos for the given id'));
    }

    const data = search.videos.reduce<CollectionFormat<Song>>(
      (acc, video) => {
        if (/video/i.test(video.type)) {
          const hasNoIdProperty = !('id' in video);
          const hasNoPublishedProperty = !('published' in video);
          const hasNoViewsProperty = !('view_count' in video);
          if (hasNoIdProperty || hasNoPublishedProperty || hasNoViewsProperty) return acc;

          acc.objects.push(new SongResource(video));
        }

        return acc;
      },
      new CollectionFormatResource<Song>({ has_more: search.has_continuation }),
    );

    res.status(200).json(data);
  } catch (err) {
    next(new ApiErrorV2(502, 'Bad Gateway', 'cannot connect to YouTube servers at the moment', err));
  }
};

const suggestion = async (
  req: Request<NoParams, CollectionFormat<string>, NoBody, { q: string }>,
  res: Response<CollectionFormat<string>>,
  next: NextFunction,
) => {
  const searchQuery = decodeURI(req.query.q);

  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
  });

  try {
    const suggestions = await youtube.getSearchSuggestions(searchQuery);

    const data: CollectionFormat<string> = {
      has_more: false,
      objects: suggestions,
      page: 0,
    };

    res.status(200).json(data);
  } catch (err) {
    next(new ApiErrorV2(502, 'Bad Gateway', 'cannot connect to YouTube servers at the moment', err));
  }
};

export const songController = {
  download,
  search,
  suggestion,
};
