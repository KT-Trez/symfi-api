import { songController } from '@controllers';
import { requestValidatorService } from '@services';
import express from 'express';
import { query } from 'express-validator';

const router = express.Router();

router.get(
  '/',
  query('page').optional().isInt({ min: 0 }).withMessage('optional, must be a number greater than or equal to 0'),
  query('search')
    .exists()
    .withMessage('required')
    .isString()
    .withMessage('must be a string')
    .notEmpty()
    .withMessage('must be not empty'),
  requestValidatorService,
  songController.searchThroughYouTube,
);

export { router as songRouter };
