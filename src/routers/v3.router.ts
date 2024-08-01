import { ApiSuccess } from '@resources';
import express, { type Response } from 'express';
import { songRouter } from './v3';

const router = express.Router();

router.use('/song', songRouter);

router.get('/ping', (_req, res: Response<ApiSuccess>) => {
  res.status(200).json(new ApiSuccess('API v3.0.0 is running'));
});

export { router as v3Router };
