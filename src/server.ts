import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import Innertube from 'youtubei.js';
import {LogLevel} from '../typings/enums.js';
import {searchRouter} from './routes/searchRouter.js';


const app = express();
const port = process.env.PORT ?? 3000;


app.use(cors());
app.use(express.static('public'))


app.use('/search', searchRouter);

app.use((req, res, next) => {
	if (parseInt(process.env.LOG_LEVEL) >= LogLevel.DEBUG)
		console.debug(`${req.ip} ${req.method} ${req.path}`, new Date());
	next();
});

// temp placeholder; refactor later
app.get('/download', async (req, res) => {
	const youtube = await new Innertube();
	const search = await youtube.search('rick');

	//@ts-ignore
	const stream = youtube.download(search.videos[0].id, {
		format: 'webm', // defaults to mp4
		type: 'audio'
	});

	//@ts-ignore
	stream.pipe(fs.createWriteStream(`./cache/${search.videos[0].id}.wav`));

	stream.on('start', () => {
		console.info('[YOUTUBE.JS]', 'Starting now!');
	});

	stream.on('info', (info) => {
		console.info('[YOUTUBE.JS]', `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
	});

	stream.on('progress', (info) => {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`[YOUTUBE.JS] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`);
	});

	stream.on('end', () => {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		console.info('[YOUTUBE.JS]', 'Done!');
	});

	stream.on('error', (err) => console.error('[ERROR]', err));

	//@ts-ignore
	fs.createReadStream(`./cache/${search.videos[0].id}.wav`).pipe(res);
})


app.listen(port, () => {
	if (parseInt(process.env.LOG_LEVEL) >= LogLevel.INFO)
		console.info('Server started - :' + port, new Date());
})