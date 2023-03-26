import cors from 'cors';
import {EventEmitter} from 'events';
import express, {Express} from 'express';
import Cache, {FileSystemCache} from 'file-system-cache';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {Lib} from '../../typings/module.js';
import {v2Router} from '../routes/v2.js';
import Logger, {LogLevel} from './Logger.js';
import CustomHandler = Lib.CustomHandler;

export default class Server {
	static #customHandlers: CustomHandler[] = [];
	static _instance: Server;

	public static use(cb: (req: express.Request, res: express.Response) => void) {
		this.#customHandlers.push(cb);
	}

	public static get instance() {
		if (!this._instance)
			this._instance = new Server();
		return this._instance;
	}

	readonly app: Express;
	cache: FileSystemCache;
	config?: Partial<Lib.Config>;
	messenger: EventEmitter;

	private constructor() {
		this.app = express();
	}

	configure(config: Partial<Lib.Config>) {
		const defaultConfig: Lib.Config = {
			cache: {
				path: path.resolve(process.env.npm_package_config_cache_path)
			},
			download: {
				useProxy: /true/.test(process.env.npm_package_config_download_useProxy)
			},
			express: {
				port: parseInt(process.env.npm_package_config_express_port)
			},
			sync: {
				IDLength: parseInt(process.env.npm_package_config_sync_IDLength),
				storeTimeoutMS: parseInt(process.env.npm_package_config_sync_storeTimeoutMS)
			},
			workers: {
				maxCount: parseInt(process.env.npm_package_config_workers_maxCount)
			}
		};

		this.config = {
			...defaultConfig,
			...config
		};

		return this;
	}

	#initializeCache() {
		let cachePath = this.config.cache.path;

		try {
			if (!fs.existsSync(cachePath))
				fs.mkdirSync(cachePath);
		} catch (err) {
			cachePath = path.join(os.tmpdir(), 'musicly_lib');

			if (!fs.existsSync(cachePath))
				fs.mkdirSync(cachePath);

			this.config.cache.path = cachePath;
		} finally {
			this.cache = Cache({
				basePath: cachePath,
				extension: '.tmp',
				ns: 'media'
			});
		}
	}

	#initializeCustomHandlers() {
		this.app.use((req, res, next) => {
			for (const customHandler of Server.#customHandlers)
				customHandler(req, res);
			next();
		});
	}

	#initializeHandlers() {
		this.app.use(cors());
		this.app.use(express.static('public'));

		this.app.use((req, res, next) => {
			Logger.log(req.path, LogLevel.Info);
			next();
		});

		this.app.use('/v2', v2Router);
	}

	#initializeMessenger() {
		this.messenger = new EventEmitter();
	}

	#startExpress() {
		this.app.listen(this.config.express.port, () => {
			// console.log('Server started');
			// Logger.log('Server started - :' + this.app.locals, LogLevel.Success)
		});
	}

	start() {
		this.#initializeCache();
		this.#initializeCustomHandlers();
		this.#initializeHandlers();
		this.#initializeMessenger();

		this.#startExpress();
	}
}
