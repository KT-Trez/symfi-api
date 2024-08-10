import { ApiSuccess } from '@resources';
import express, { type Response } from 'express';
import { songRouter } from './v3';

const router = express.Router();

router.use('/song', songRouter);

router.get('/ping', (_req, res: Response<ApiSuccess>) => {
  res.status(200).json(new ApiSuccess('API v3.0.0 is running'));
});

router.get('/version', (_req, res: Response<ApiSuccess>) => {
  res
    .status(200)
    .json(new ApiSuccess(process.env.npm_package_version || '4.x.x'));
});

export { router as v3Router };
