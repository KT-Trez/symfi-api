import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Cache } from 'file-system-cache';
import { Log, Platform } from 'youtubei.js';
import { ApiError, ApiErrorV2 } from './resources/ApiError.ts';
import { v2Router } from './routers/v2.router.ts';
import { v3Router } from './routers/v3.router.ts';
import { Logger } from './services/logger.service.ts';
import { createJavaScriptInterpreter } from './utils/createJavaScriptInterpreter.ts';

Log.setLevel(Log.Level.ERROR);
Platform.shim.eval = createJavaScriptInterpreter();

export const app = express();
const port = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 5000;

// initialize cache
let cachePath = path.resolve('cache');
try {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
} catch (_err) {
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
  legacyHeaders: false,
  limit: 500, // max 100 requests per windowMs
  message: new ApiErrorV2(429, 'Too Many Requests', 'You have exceeded the 100 requests in 15 minutes limit!'),
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

const logger = new Logger();

// initialize handlers
app.use(cors());

app.use((req, _res, next) => {
  if (process.env.DEBUG || process.env.LOG_REQUESTS) {
    logger.log(`${req.method} ${req.originalUrl}`);
  }
  next();
});

app.use('/v2', limiter, v2Router);
app.use('/v3', limiter, v3Router);

// app.all('*', (_req, _res, next: NextFunction) => {
//   next(new ApiErrorV2(404, 'Not Found', 'The requested resource was not found.'));
// });

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.log(`${err.message} | ${err.cause}`, 'ERROR');

  if (err instanceof ApiError) {
    res.status(err.status).json(err);
  } else if (err instanceof ApiErrorV2) {
    res.status(err.http_status).json(err);
  } else {
    res.status(500).json('Internal Server Error');
  }
});

export const server = app.listen(port, () => {
  logger.log(`Status: [STARTED], PORT: [${port}], Version: [v${process.env.npm_package_version}]`);
});
