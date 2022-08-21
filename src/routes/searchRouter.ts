import express from 'express';
import {query} from 'express-validator';
import searchController from '../controllers/searchController.js';


const router = express.Router();

router.get('/youtube',
	query('keywords', 'missing from query').not().isEmpty(),
	query('keywords', 'keywords must be a string').isString(),
	searchController.youtube);

export {
	router as searchRouter
};