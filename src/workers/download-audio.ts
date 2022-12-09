import fs from 'fs';
import {parentPort, workerData} from 'worker_threads';
import {Innertube, UniversalCache} from 'youtubei.js';
import {LogLevel} from '../../typings/enums.js';
import * as path from 'path';


/**
 * Converts stream to iterable chunks.
 * @param stream - the stream to convert
 */
export async function* streamToIterable(stream: ReadableStream<Uint8Array>) {
	const reader = stream.getReader();

	try {
		while (true) {
			const {done, value} = await reader.read();
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
 * Downloads audio file from YouTube.
 */
const downloadAudio = async () => {
	const youtube = await Innertube.create({
		cache: new UniversalCache()
	});
	const videoID = workerData.videoID;

	const stream = await youtube.download(videoID, {
		type: 'audio',
		quality: 'best'
	});

	const mediaCacheDirPath = path.resolve('cache');
	if (!fs.existsSync(mediaCacheDirPath))
		fs.mkdirSync(mediaCacheDirPath);

	const mediaPath = path.join(mediaCacheDirPath, `${videoID}.wav`);
	const mediaFile = fs.createWriteStream(mediaPath);

	for await (const chunk of streamToIterable(stream))
		mediaFile.write(chunk);

	if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
		console.info('downloaded video: ' + videoID, new Date());

	parentPort.postMessage({
		path: mediaPath,
		type: 'end'
	});

	process.exit();
};

downloadAudio();
