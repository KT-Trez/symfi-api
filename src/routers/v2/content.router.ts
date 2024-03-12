import { requestValidatorService } from '@services';
import express from 'express';
import { body, param } from 'express-validator';
import { Innertube, UniversalCache } from 'youtubei.js';
import { contentController } from '../../controllers/v2';

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
    .withMessage('incorrect id, no such content'),
  requestValidatorService,
  contentController.streamAudio,
);

router.use(express.json());

router.post(
  '/check',
  body().isArray({ min: 1 }).withMessage('incorrect payload, ids to check should be an array'),
  requestValidatorService,
  contentController.checkIdsCorrectness,
);

export { router as contentRouter };
