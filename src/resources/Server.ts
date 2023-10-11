import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import Cache, { FileSystemCache } from 'file-system-cache';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { v2Router } from '../routers/v2.router';
import { HandlerFn } from '../types/handlerFn';
import { ServerConfig } from '../types/serverConfig';
import { ApiError } from './ApiError';
import { Messenger } from './Messenger';

export class Server {
  static #customHandlers: HandlerFn[] = [];
  static #instance: Server;
  readonly app: Express;
  readonly cache: FileSystemCache;
  config: ServerConfig;
  readonly messenger: Messenger;

  private constructor() {
    this.app = express();
    this.config = {
      cache: {
        path: path.resolve('cache'),
      },
      download: {
        useProxy: false,
      },
      express: {
        port: 3000,
      },
      sync: {
        IDLength: 6,
        storeTimeoutMS: 1000 * 60 * 60 * 24,
      },
      workers: {
        maxCount: 10,
      },
    };
    this.cache = this.#createCache();
    this.messenger = new Messenger();
  }

  static get instance() {
    if (!this.#instance) {
      this.#instance = new Server();
    }
    return this.#instance;
  }

  static use(cb: (req: express.Request, res: express.Response) => void) {
    this.#customHandlers.push(cb);
  }

  configure(config: Partial<ServerConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };

    return this;
  }

  start() {
    this.#createCache();
    this.#initializeCustomHandlers();
    this.#initializeHandlers();

    this.#startExpress();
  }

  #createCache() {
    let cachePath = this.config.cache.path;

    try {
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }
    } catch (err) {
      cachePath = path.join(os.tmpdir(), 'musicly');
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      this.config.cache.path = cachePath;
      this.messenger.message(
        'WARNING',
        `cache path failed, using fallback: ${cachePath}`,
      );
    }

    return Cache({
      basePath: cachePath,
      extension: '.tmp',
      ns: 'media',
    });
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

    this.app.use((req, res, next) => {
      this.messenger.message('INFO', `${req.method} ${req.originalUrl}`);
      next();
    });

    this.app.use('/v2', v2Router);

    this.app.all('*', (_req, res, next: NextFunction) => {
      next(new ApiError('Not Found', 404));
    });

    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof ApiError) {
          this.messenger.message('ERROR', err.message);
          res.status(err.status).json(err);
        } else {
          // eslint-disable-next-line no-console
          console.error(err);
          res.status(500).json('Internal Server Error');
        }
      },
    );
  }

  #startExpress() {
    this.app.listen(this.config.express.port, () => {
      const port = this.config.express.port;
      this.messenger.message('INFO', `Server process started :${port}`);
    });
  }
}
