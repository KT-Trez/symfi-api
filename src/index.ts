import cors from 'cors';
import {EventEmitter} from 'events';
import express, {Express} from 'express';
import Cache, {FileSystemCache} from 'file-system-cache';
import path from 'path';
import {Lib} from '../typings/module';
import Logger, {LogLevel} from './classes/Logger';
import {v2Router} from './routes/v2';


const app: Express = express();
let appON = false;
const cache: FileSystemCache = Cache({
	basePath: path.resolve('cache'),
	extension: '.tmp',
	ns: 'media'
});
const customHandlers: ((req: express.Request, res: express.Response) => void)[] = [];
const emitter = new EventEmitter();


app.use(cors());
app.use(express.static('public'));

app.use((req, res, next) => {
	Logger.log(req.path, LogLevel.Info);
	next();
});

// load custom handlers passed to the lib
app.use((req, res, next) => {
	for (const customHandler of customHandlers)
		customHandler(req, res);
	next();
});

app.use('/v2', v2Router);

const lib = {
	emitter,
	start,
	use
};

function start({cachePath, logLevel, maxWorkersCount, port, useLocal}: Lib.StartConfig) {
	if (appON)
		return;

	if (cachePath)
		cache.basePath = cachePath;

	app.listen(port, () => {
		Logger.log('Server started - :' + port, LogLevel.Success);
	});

	process.env.LOG_LEVEL = logLevel?.toString();
	process.env.MAX_WORKER_COUNT = maxWorkersCount?.toString();
	process.env.USE_LOCAL = useLocal?.toString();

	appON = true;
}

function use(cb: (req: express.Request, res: express.Response) => void) {
	if (!app)
		throw Error('can\'t register a handler', {cause: 'server not started'});
	customHandlers.push(cb);
}

export default lib;

export {
	app,
	cache
};
