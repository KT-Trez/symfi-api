import 'dotenv/config';
import { ApiError, ApiErrorV2 } from '@resources';
import { v2Router, v3Router } from '@routers';
import { Logger } from '@services';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Cache } from 'file-system-cache';
import fs from 'fs';
import os from 'os';
import path from 'path';

if (process.env.NODE_ENV === 'test') {
  delete process.env.DEBUG;
  delete process.env.LOG_REQUESTS;
}

export const app = express();
const port = process.env.PORT || 5000;

// initialize cache
let cachePath = path.resolve('cache');
try {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
} catch (err) {
  cachePath = path.join(os.tmpdir(), 'symfi');
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
}

export const cache = new Cache({
  basePath: cachePath,
  extension: '.tmp',
  ns: 'media',
});

export const limiter = rateLimit({
  limit: 500, // max 100 requests per windowMs
  legacyHeaders: false,
  message: new ApiErrorV2(429, 'Too Many Requests', 'You have exceeded the 100 requests in 15 minutes limit!'),
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

const logger = new Logger();

// initialize handlers
app.use(cors());

app.use((req, _res, next) => {
  if (process.env.DEBUG || process.env.LOG_REQUESTS) logger.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/v2', limiter, v2Router);
app.use('/v3', limiter, v3Router);

app.all('*', (_req, _res, next: NextFunction) => {
  next(new ApiErrorV2(404, 'Not Found', 'The requested resource was not found.'));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.status).json(err);
  } else if (err instanceof ApiErrorV2) {
    res.status(err.http_status).json(err);
  } else {
    logger.log(`${err.message} | ${err.cause}`, 'ERROR');
    res.status(500).json('Internal Server Error');
  }
});

// start express
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.log(`Status: [STARTED], PORT: [${port}], Version: [v${process.env.npm_package_version}]`);
  });
}
