import fs from 'node:fs';
import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache } from 'youtubei.js';
import { cache } from '../../main.ts';
import { ApiError } from '../../resources/ApiError.ts';
import { VideoInfoToMediaInfoAdapter } from '../../resources/VideoInfoToMediaInfoAdapter.ts';
import { getResource } from '../../services/download.service.ts';
import { transcodeAudioToCodec } from '../../services/transcode.service.ts';
import type { MediaInfo } from '../../types/mediaInfo.ts';
import type { VideoInfo } from '../../types/video.ts';

const checkIdsCorrectness = async (
  req: Request<Record<string, never>, MediaInfo[], string[]>,
  res: Response<MediaInfo[]>,
  next: NextFunction,
) => {
  const ids = req.body;

  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
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
  const cacheKey = `song-wav-${resourceID}`;
  const cachedPath = cache.getSync(cacheKey);

  try {
    // if the resource was already downloaded (the path to resource was cached),
    // stream downloaded resource
    if (cachedPath) {
      return fs.createReadStream(cachedPath).pipe(res.setHeader('Content-Type', 'audio/wav'));
    }

    const rawResourcePath = await getResource(resourceID);
    const resourcePath = await transcodeAudioToCodec(rawResourcePath);

    cache.setSync(cacheKey, resourcePath);
    fs.createReadStream(resourcePath).pipe(res.setHeader('Content-Type', 'audio/wav'));
  } catch (err) {
    next(new ApiError('failed to download audio', 500, err));
  }
};

export const contentController = {
  checkIdsCorrectness,
  streamAudio,
};
