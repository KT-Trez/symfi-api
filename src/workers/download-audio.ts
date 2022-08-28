import fs from 'fs';
import {workerData, parentPort} from 'worker_threads';
import Innertube from 'youtubei.js';
import {LogLevel} from '../../typings/enums.js';


const youtube = await new Innertube();
const videoID = workerData.videoID;

const stream = youtube.download(videoID, {
	format: 'webm',
	type: 'audio'
});

const videoPath = `./cache/${videoID}.wav`
stream.pipe(fs.createWriteStream(videoPath));

stream
	.on('end', () => {
		if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
			console.info('downloaded video: ' + videoID, new Date());

		parentPort.postMessage({
			path: videoPath,
			type: 'end'
		});
		process.exit();
	})
	.on('error', (err) => {
		if (parseInt(process.env.LOG_LEVEL) > LogLevel.WARNING)
			console.error('downloading video ended with error: ', err, new Date());

		parentPort.postMessage({
			error: err,
			type: 'error'
		});
		process.exit(500);
	})
	.on('info', (info) => {
		if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
			console.info('selected video | ' + info.video_details.title + '[' + info.video_details.metadata.channel_name + ']', new Date());
	})
	.on('progress', (info) => {
		if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
			console.info(videoID + 'progress | ' + info.downloaded_size + '/' + info.size + 'MB (' + info.percentage + ')%', new Date());
	})
	.on('start', () => {
		if (parseInt(process.env.LOG_LEVEL) > LogLevel.DEBUG)
			console.info('starting to download video: ' + videoID, new Date());
	});