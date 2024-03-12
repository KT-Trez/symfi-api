import { songController } from '@controllers';
import { requestValidatorService } from '@services';
import express from 'express';
import { query } from 'express-validator';

const router = express.Router();

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

export { router as songRouter };
