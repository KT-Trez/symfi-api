import { searchController } from '@controllers';
import { requestValidatorService } from '@services';
import express from 'express';
import { query } from 'express-validator';

const router = express.Router();

router.get(
  '/youtube',
  query('query').notEmpty().withMessage('required, must be a string'),
  requestValidatorService,
  searchController.searchThroughYouTube,
);

export { router as searchRouter };
