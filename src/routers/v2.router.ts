import express, { Response } from 'express';
import { contentRouter } from './v2/content.router';
import { mediaRouter } from './v2/media.router';
import { searchRouter } from './v2/search.router';

const router = express.Router();

router.use('/content', contentRouter);
router.use('/media', mediaRouter);
router.use('/search', searchRouter);

router.get('/ping', (_req, res: Response<{ success: boolean }>) => {
  res.status(200).json({ success: true });
});

export { router as v2Router };
