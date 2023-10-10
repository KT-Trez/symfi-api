import express from 'express';
import { query } from 'express-validator';
import { searchController } from '../../controllers/v2/search.controller';

const router = express.Router();

router.get(
  '/youtube',
  query('query').notEmpty().withMessage('required, must be a string'),
  searchController.searchThroughYouTube, // todo: investigate ts error
);

export { router as searchRouter };
