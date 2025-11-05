import express, { type Response } from 'express';
import { contentRouter } from './v2/content.router.ts';
import { mediaRouter } from './v2/media.router.ts';
import { searchRouter } from './v2/search.router.ts';

const router = express.Router();

router.use('/content', contentRouter);
router.use('/media', mediaRouter);
router.use('/search', searchRouter);

router.get('/ping', (_req, res: Response<{ success: boolean }>) => {
  res.status(200).json({ success: true });
});

export { router as v2Router };
