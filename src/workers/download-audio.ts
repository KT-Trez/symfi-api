import fs from 'fs';
import {parentPort, workerData} from 'worker_threads';
import {Innertube, UniversalCache} from 'youtubei.js';
import path from 'path';
import Logger, {LogLevel} from '../classes/Logger';


/**
 * Sends a message to main thread, using parentPort API.
 * @param messageType - the message type.
 * @param messagePayload - the message data.
 */
const messageMainThread = (messageType: 'end' | 'error', messagePayload: object) => {
	parentPort.postMessage({
		...messagePayload,
		type: messageType
	});
};

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
	const mediaID = workerData.videoID;

	try {
		const stream = await youtube.download(mediaID, {
			type: 'audio',
			quality: 'best'
		});

		const mediaCacheDirPath = path.resolve('cache');
		if (!fs.existsSync(mediaCacheDirPath))
			fs.mkdirSync(mediaCacheDirPath);

		const mediaPath = path.join(mediaCacheDirPath, `${mediaID}.wav`);
		const mediaFile = fs.createWriteStream(mediaPath);

		const onStreamClose = () => {
			Logger.log('resource downloaded: ' + mediaID);
			messageMainThread('end', {path: mediaPath});
			process.exit();
		};
		mediaFile.on('close', onStreamClose);

		for await (const chunk of streamToIterable(stream))
			mediaFile.write(chunk);
		mediaFile.close();
	} catch (err) {
		Logger.log(err.message, LogLevel.Error);
		messageMainThread('error', {error: new Error(err.message, {cause: err.cause})});
		process.exit();
	}
};

downloadAudio();
