import cors from 'cors';
import {EventEmitter} from 'events';
import express, {Express} from 'express';
import Cache, {FileSystemCache} from 'file-system-cache';
import {Server} from 'http';
import path from 'path';
import {Lib} from '../typings';
import Logger, {LogLevel} from './classes/Logger';
import {v2Router} from './routes/v2';


const app: Express = express();
const cache: FileSystemCache = Cache({
	basePath: path.resolve('cache'),
	extension: '.tmp',
	ns: 'media'
});
const emitter = new EventEmitter();
let server: Server;


app.use(cors());
app.use(express.static('public'));

app.use((req, res, next) => {
	Logger.log(req.path, LogLevel.Info);
	next();
});

app.use('/v2', v2Router);

const musicly_lib = {
	emitter,
	start,
	stop
};

function start({logLevel, maxWorkersCount, port, useLocal}: Lib.StartConfig) {
	server = app.listen(port, () => {
		Logger.log('Server started - :' + port, LogLevel.Success);
	});

	process.env.LOG_LEVEL = logLevel?.toString();
	process.env.MAX_WORKER_COUNT = maxWorkersCount?.toString();
	process.env.USE_LOCAL = useLocal?.toString();
}

function stop() {
	server.close();
}

export default musicly_lib;

export {
	app,
	cache
};
