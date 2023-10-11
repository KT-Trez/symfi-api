import express, { Response } from 'express';
import { contentRouter, mediaRouter, searchRouter } from './v2';

const router = express.Router();

router.use('/content', contentRouter);
router.use('/media', mediaRouter);
router.use('/search', searchRouter);

router.get('/ping', (_req, res: Response<{ success: boolean }>) => {
  res.status(200).json({ success: true });
});

export { router as v2Router };
