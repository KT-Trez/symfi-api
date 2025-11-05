import express from 'express';
import { query } from 'express-validator';
import { searchController } from '../../controllers/v2/search.controller.ts';
import { requestValidatorService } from '../../services/requestValidator.service.ts';

const router = express.Router();

router.get(
  '/youtube',
  query('query').notEmpty().withMessage('required, must be a string'),
  requestValidatorService,
  searchController.searchThroughYouTube,
);

export { router as searchRouter };
