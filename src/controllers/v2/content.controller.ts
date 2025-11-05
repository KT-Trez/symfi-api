import fs from 'node:fs';
import { cache } from '@app';
import { ApiError, VideoInfoToMediaInfoAdapter } from '@resources';
import { getResource } from '@services';
import type { MediaInfo, VideoInfo } from '@types';
import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache } from 'youtubei.js';

const checkIdsCorrectness = async (
  req: Request<Record<string, never>, MediaInfo[], string[]>,
  res: Response<MediaInfo[]>,
  next: NextFunction,
) => {
  const ids = req.body;

  const youtube = await Innertube.create({
    cache: new UniversalCache(false),
  });

  const requestedMediaInfo: Promise<VideoInfo>[] = [];
  for (const id of ids) {
    requestedMediaInfo.push(youtube.getInfo(id));
  }

  const mediaInfoPromises = await Promise.allSettled(requestedMediaInfo);

  try {
    const data = mediaInfoPromises
      .filter((promise): promise is PromiseFulfilledResult<VideoInfo> => promise.status === 'fulfilled')
      .map(({ value }) => new VideoInfoToMediaInfoAdapter(value));

    res.status(200).json(data);
  } catch (err) {
    next(new ApiError('failed to check ids', 502, err));
  }
};

const streamAudio = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  // get resource id and path to resource if it is cached
  const resourceID = decodeURI(req.params.id);
  const cachedPath = cache.getSync(resourceID);

  try {
    // if the resource was already downloaded (the path to resource was cached),
    // stream downloaded resource
    if (cachedPath) {
      return fs.createReadStream(cachedPath).pipe(res);
    }

    const resourcePath = await getResource(resourceID);
    fs.createReadStream(resourcePath).pipe(res);

    cache.setSync(resourceID, resourcePath);
  } catch (err) {
    next(new ApiError('failed to download audio', 500, err));
  }
};

export const contentController = {
  checkIdsCorrectness,
  streamAudio,
};
