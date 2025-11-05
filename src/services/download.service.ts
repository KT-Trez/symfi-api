import fs from 'node:fs';
import path from 'node:path';
import { Innertube, UniversalCache, Utils } from 'youtubei.js';

/**
 * Downloads an audio file from YouTube.
 */
export const getResource = async (
  resourceId: string,
  resourceType: 'audio' | 'video' | 'video+audio' = 'audio',
): Promise<string> => {
  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
    generate_session_locally: true,
  });

  const stream = await youtube.download(resourceId, {
    client: 'YTMUSIC',
    quality: 'best',
    type: resourceType,
  });

  const resourceCacheDirPath = path.resolve('cache');
  if (!fs.existsSync(resourceCacheDirPath)) {
    fs.mkdirSync(resourceCacheDirPath);
  }

  const resourcePath = path.resolve(resourceCacheDirPath, resourceId);
  const resource = fs.createWriteStream(resourcePath);

  for await (const chunk of Utils.streamToIterable(stream)) {
    resource.write(chunk);
  }

  return resourcePath;
};
