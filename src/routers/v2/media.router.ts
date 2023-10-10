import express from 'express';
import { param } from 'express-validator';
import { Innertube, UniversalCache } from 'youtubei.js';
import { mediaController } from '../../controllers/v2/media.controller';

const router = express.Router();

router.get(
  ['/youtube', '/youtube/:id'],
  param('id')
    .notEmpty()
    .withMessage('required, must be a string')
    .bail()
    .custom(async (_, { req }) => {
      const audioID = req.params!.id;

      const youtube = await Innertube.create({
        cache: new UniversalCache(false),
      });

      return !!(await youtube.getInfo(audioID));
    })
    .withMessage('incorrect id, no such media'),
  mediaController.getMediaURL,
);

export { router as mediaRouter };
