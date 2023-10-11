// noinspection ES6UnusedImports
import { EventEmitter } from 'events';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Innertube, UniversalCache } from 'youtubei.js';
import { ApiError, Server, VideoInfoToMediaInfoAdapter } from '../../resources';
import { Manager } from '../../services/download.service';
import { MediaInfo } from '../../types/mediaInfo';
import { VideoInfo } from '../../types/video';
import { AudioDownloadParentPort } from '../../types/workers';

class Queue {
  /**
   * Map containing all queued items.
   */
  public static readonly map = new Map<string, Queue>();
  // instance
  private readonly eventEmitter = new EventEmitter();
  private readonly id: string;

  constructor(id: string) {
    this.id = id;
    Queue.map.set(this.id, this);
  }

  /**
   * Sends event to all queued items, notifying that media has been downloaded and is ready to be streamed to clients.
   * Removes
   * @param id - The resource id
   */
  public static announceResourceAvailable(id: string) {
    if (!this.map.has(id)) {
      return;
    }

    this.map.get(id)!.eventEmitter.emit('resource:ready');
    this.map.delete(id);
  }

  /**
   * Adds new item to queue.
   * Item's handler will be executed once media with specified id will finish downloading.
   * @param id - the id of the media.
   * @param handler - handler that will be executed.
   */
  public static waitToStreamResource(id: string, handler: () => void) {
    this.map.get(id)!.subscribe(handler);
  }

  /**
   * Executes handler, after media with this item's id will finish downloading.
   * @param handler - the handler to execute,
   */
  subscribe(handler: () => void) {
    this.eventEmitter.once('resource:ready', handler);
  }
}

const checkIdsCorrectness = async (
  req: Request<undefined, MediaInfo[], string[]>,
  res: Response<MediaInfo[]>,
  next: NextFunction,
) => {
  const ids = req.body;

  const youtube = await Innertube.create({
    cache: new UniversalCache(false),
  });

  const requestedMediaInfo: Promise<VideoInfo>[] = [];
  ids.forEach(id => requestedMediaInfo.push(youtube.getInfo(id)));

  const mediaInfoPromises = await Promise.allSettled(requestedMediaInfo);

  try {
    const data = mediaInfoPromises
      .filter(
        (promise): promise is PromiseFulfilledResult<VideoInfo> =>
          promise.status === 'fulfilled',
      )
      .map(({ value }) => new VideoInfoToMediaInfoAdapter(value));

    res.status(200).json(data);
  } catch (err) {
    next(new ApiError('failed to check ids', 502, err));
  }
};

const streamAudio = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  // get media id and path to resource if it's cached
  const mediaID = decodeURI(req.params.id);
  const cachedPath = Server.instance.cache.getSync(mediaID);

  // function that streams media resource to client
  const streamAudio = () => fs.createReadStream(cachedPath).pipe(res);

  // if resource was already downloaded (path to resource was cached), stream downloaded resource
  if (cachedPath) {
    return streamAudio();
  }

  // if media is being downloaded, push response with streaming handler to queue, and wait for the end of the download
  if (Queue.map.has(mediaID))
    return Queue.waitToStreamResource(mediaID, streamAudio);

  // 'message' event handler of download worker
  const onMessage = (message: AudioDownloadParentPort) => {
    switch (message.type) {
      case 'end':
        Server.instance.cache.set(mediaID, message.path);
        Queue.announceResourceAvailable(mediaID);
        fs.createReadStream(message.path).pipe(res);
        break;
      case 'error':
        next(new ApiError('failed to download audio', 502, message.error));
        break;
    }
  };
  try {
    // push new download worker to workers queue
    Manager.addToQueue(
      { videoID: mediaID }, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      path.resolve(__dirname, '../../../dist/workers/download-audio.js'), // @ts-ignore
      onMessage,
    );
  } catch (err) {
    next(new ApiError('failed to download audio', 500, err));
  }
};

export const contentController = {
  checkIdsCorrectness,
  streamAudio,
};
