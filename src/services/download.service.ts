import fs from 'node:fs';
import path from 'node:path';
import type { ReadableStream } from 'node:stream/web';
import { Innertube, UniversalCache } from 'youtubei.js';

/**
 * Converts stream to iterable chunks.
 * @param stream - the stream to convert
 */
export async function* streamToIterable(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Downloads an audio file from YouTube.
 */
export const getResource = async (
  resourceId: string,
  resourceType: 'audio' | 'video' | 'video+audio' = 'audio',
): Promise<string> => {
  const youtube = await Innertube.create({
    cache: new UniversalCache(true),
    generate_session_locally: true
  });

  const stream = await youtube.download(resourceId, {
    type: resourceType,
    // todo: fix in youtubei.js
    // quality: 'best',
  });

  const resourceCacheDirPath = path.resolve('cache');
  if (!fs.existsSync(resourceCacheDirPath)) {
    fs.mkdirSync(resourceCacheDirPath);
  }

  const resourcePath = path.resolve(resourceCacheDirPath, `${resourceId}.wav`);
  const resource = fs.createWriteStream(resourcePath);

  return await new Promise((resolve, reject) => {
    resource.on('close', () => resolve(resourcePath));
    resource.on('error', err => reject(err));

    const execute = async () => {
      for await (const chunk of streamToIterable(stream)) {
        resource.write(chunk);
      }
      resource.close();
    };

    execute();
  });
};
