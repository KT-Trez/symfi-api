import express from 'express';
import {query} from 'express-validator';
import searchController from '../controllers/searchController.js';


const router = express.Router();

router.get('/youtube',
	query('query', 'missing query variable').not().isEmpty().isString(),
	searchController.youtube);

export {
	router as searchRouter
};
