import { songController } from '@controllers';
import { requestValidatorService } from '@services';
import express from 'express';
import { param, query } from 'express-validator';
import { Innertube, UniversalCache } from 'youtubei.js';

const router = express.Router();

router.get(
  '/download',
  query('id')
    .exists()
    .withMessage('required')
    .isString()
    .withMessage('must be a string')
    .notEmpty()
    .withMessage('must be not empty'),
  requestValidatorService,
  songController.download,
);

router.get(
  ['/meta', '/meta/:id'],
  param('id')
    .notEmpty()
    .withMessage('required, must be a string')
    .bail()
    .custom(async (_, { req }) => {
      const audioID = req.params?.id;

      const youtube = await Innertube.create({
        cache: new UniversalCache(false),
      });

      return !!(await youtube.getInfo(audioID));
    })
    .withMessage('incorrect id, no such song'),
  requestValidatorService,
  songController.meta,
);

router.get(
  '/search',
  query('page').optional().isInt({ min: 0 }).withMessage('optional, must be a number greater than or equal to 0'),
  query('q')
    .exists()
    .withMessage('required')
    .isString()
    .withMessage('must be a string')
    .notEmpty()
    .withMessage('must be not empty'),
  requestValidatorService,
  songController.search,
);

router.get(
  '/suggestion',
  query('q')
    .exists()
    .withMessage('required')
    .isString()
    .withMessage('must be a string')
    .notEmpty()
    .withMessage('must be not empty'),
  requestValidatorService,
  songController.suggestion,
);

router.get('/:id', param('id'), songController.songId);

export { router as songRouter };
