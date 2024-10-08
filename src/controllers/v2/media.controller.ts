import { ApiError } from '@resources';
import type { NextFunction, Request, Response } from 'express';
import { Innertube, UniversalCache } from 'youtubei.js';

const getMediaURL = async (
  req: Request<{ id: string }, { link: string }>,
  res: Response<{ link: string }>,
  next: NextFunction,
) => {
  // the media's id
  const id = req.params.id;

  // redirect request to the local endpoint that streams audio
  if (process.env.PROXY_DOWNLOAD_ENABLED) {
    const streamEndpointEnv = process.env.PROXY_DOWNLOAD_STREAM_ENDPOINT;
    const hasCustomStreamEndpoint = streamEndpointEnv?.match(/true/i);

    const origin = process.env.PROXY_DOWNLOAD_ORIGIN || `${req.protocol}://${req.get('host')}`;
    const path = hasCustomStreamEndpoint ? `/v3/song/stream/${id}` : `/v3/song/${id}`;

    const url = new URL(path, origin);

    return res.status(200).json({
      link: url.href,
    });
  }

  // search instance of the YouTube's API
  const youtube = await Innertube.create({
    cache: new UniversalCache(false),
  });

  // find an external media stream, extract and send its link to the client
  try {
    const videoInfo = await youtube.getInfo(id);
    const audioLink = videoInfo.chooseFormat({
      type: 'audio',
      quality: 'best',
    });

    const data: { link: string } = {
      link: audioLink.decipher(youtube.session.player),
    };

    res.status(200).json(data);
  } catch (err) {
    next(new ApiError('failed to get media URL', 502, err));
  }
};

export const mediaController = {
  getMediaURL,
};
