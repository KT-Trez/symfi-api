import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import Cache, { FileSystemCache } from 'file-system-cache';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { v2Router } from '../routers/v2.router';
import type { ServerConfig } from '../types';
import { ApiError } from './ApiError';
import { Messenger } from './Messenger';

export class Server {
  readonly app: Express;
  readonly cache: FileSystemCache;
  config: ServerConfig = {
    appPort: 3000,
    cachePath: path.resolve('cache'),
    downloadThroughProxy: false,
    maxWorkers: 10,
    sync: {
      IDLength: 6,
      storeTimeoutMS: 1000 * 60 * 60 * 24,
    },
  };
  readonly messenger: Messenger = new Messenger();

  private constructor() {
    this.app = express();
    this.cache = this.createCache();
  }

  private static _instance: Server;

  static get instance() {
    if (!this._instance) {
      this._instance = new Server();
    }
    return this._instance;
  }

  configure(config: Partial<ServerConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };

    return this;
  }

  start() {
    this.createCache();
    this.initializeHandlers();

    this.startExpress();
  }

  private createCache() {
    let cachePath = this.config.cachePath;

    try {
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }
    } catch (err) {
      cachePath = path.join(os.tmpdir(), 'musicly');
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      this.config.cachePath = cachePath;
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

  private initializeHandlers() {
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

  private startExpress() {
    this.app.listen(this.config.appPort, () => {
      const appPort = this.config.appPort;
      this.messenger.message('INFO', `Server process started :${appPort}`);
    });
  }
}
