import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache } from 'youtubei.js';
import { ApiError } from '../../resources/ApiError.ts';

const getMediaURL = async (
  req: Request<{ id: string }, { link: string }>,
  res: Response<{ link: string }>,
  next: NextFunction,
) => {
  // the media's id
  const id = req.params.id;

  // redirect request to the local endpoint that streams audio
  if (process.env.PROXY_DOWNLOAD_ENABLED) {
    const origin = process.env.PROXY_DOWNLOAD_ORIGIN || `${req.protocol}://${req.get('host')}`;
    const path = `/v2/content/youtube/${id}`;

    const url = new URL(path, origin);

    return res.status(200).json({
      link: url.href,
    });
  }

  // search instance of the YouTube's API
  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
  });

  // find an external media stream, extract and send its link to the client
  try {
    const videoInfo = await youtube.getInfo(id);
    const audioLink = videoInfo.chooseFormat({
      // quality: 'best',
      type: 'audio',
    });

    const data: { link: string } = {
      link: await audioLink.decipher(youtube.session.player),
    };

    res.status(200).json(data);
  } catch (err) {
    next(new ApiError('failed to get media URL', 502, err));
  }
};

export const mediaController = {
  getMediaURL,
};
