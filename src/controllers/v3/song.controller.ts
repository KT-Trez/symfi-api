import { ApiErrorV2, ApiSuccess, CollectionFormatResource, SongResource } from '@resources';
import type { CollectionFormat, NoBody, NoParams, NoQuery, Song } from '@types';
import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache, Utils } from 'youtubei.js';

const download = async (
  req: Request<NoParams, NoBody, ApiSuccess, { id: string }>,
  res: Response<ApiSuccess>,
  next: NextFunction,
) => {
  const id = req.query.id;
  const isProxyEnabled = process.env.PROXY_DOWNLOAD_ENABLED?.match(/true/i);

  try {
    // search instance of the YouTube's API
    const youtube = await Innertube.create({
      cache: new UniversalCache(true),
    });

    const info = await youtube.getBasicInfo(id);

    // redirect request to the local endpoint that streams audio
    if (isProxyEnabled) {
      const streamEndpointEnv = process.env.PROXY_DOWNLOAD_STREAM_ENDPOINT;
      const hasCustomStreamEndpoint = streamEndpointEnv?.match(/true/i);

      const origin = process.env.PROXY_DOWNLOAD_ORIGIN || `${req.protocol}://${req.get('host')}`;
      const path = hasCustomStreamEndpoint ? `/v3/song/stream/${id}` : `/v3/song/${id}`;

      const url = new URL(path, origin);

      return res.status(200).json(new ApiSuccess('Video found', url.href));
    }

    const format = info.chooseFormat({
      quality: 'best',
      type: 'audio',
    });

    res.status(200).json(new ApiSuccess('Video found', format.decipher(youtube.session.player)));
  } catch (err) {
    if (err instanceof Error && /this video is unavailable/i.test(err.message)) {
      next(new ApiErrorV2(404, 'Not Found', 'The requested video was not found.'));
      return;
    }
    next(new ApiErrorV2(502, 'Bad Gateway', 'Cannot connect to YouTube servers at the moment.', err));
  }
};

const meta = (req: Request<NoParams, NoBody, NoQuery, { id: string }>, res: Response<unknown>, _: NextFunction) => {
  const id = req.params.id;

  res.redirect(307, `/v3/song/download?id=${id}`);
};

const search = async (
  req: Request<
    never,
    CollectionFormat<Song>,
    undefined,
    {
      page?: string;
      q: string;
    }
  >,
  res: Response<CollectionFormat<Song>>,
  next: NextFunction,
) => {
  // const page = Number(req.query.page); // todo: implement pagination
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
      return next(new ApiErrorV2(404, 'No resource', 'The videos matching requested query were not found.'));
    }

    const resourceMap = new Map<string, true>();

    const data = search.videos.reduce<CollectionFormat<Song>>(
      (acc, video) => {
        if (SongResource.isValue(video) && !resourceMap.has(video.id)) {
          acc.objects.push(new SongResource(video));
          resourceMap.set(video.id, true);
        }

        return acc;
      },
      new CollectionFormatResource<Song>({ has_more: search.has_continuation }),
    );

    res.status(200).json(data);
  } catch (err) {
    next(new ApiErrorV2(502, 'Bad Gateway', 'Cannot connect to YouTube servers at the moment.', err));
  }
};

const songId = async (
  req: Request<{ id: string }, unknown, NoBody, NoQuery>,
  res: Response<unknown>,
  next: NextFunction,
) => {
  const id = req.params.id;

  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
    generate_session_locally: true,
  });

  try {
    const stream = await youtube.download(id, {
      format: 'webm',
      type: 'audio',
      quality: 'best',
    });

    for await (const chunk of Utils.streamToIterable(stream)) {
      res.write(chunk);
    }

    res.end();
  } catch (err) {
    const isError = err instanceof Error;

    if (isError && /this video is unavailable/i.test(err.message)) {
      const error = new ApiErrorV2(404, 'Not Found', 'The requested video was not found.');

      return next(error);
    }

    if (isError && /no matching formats found/i.test(err.message)) {
      const error = new ApiErrorV2(404, 'Not Found', 'Matching formats in the requested video were not found.');

      return next(error);
    }

    const error = new ApiErrorV2(502, 'Bad Gateway', 'Cannot connect to YouTube servers at the moment.', err);

    next(error);
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
    next(new ApiErrorV2(502, 'Bad Gateway', 'Cannot connect to YouTube servers at the moment.', err));
  }
};

export const songController = {
  download,
  meta,
  search,
  songId,
  suggestion,
};
