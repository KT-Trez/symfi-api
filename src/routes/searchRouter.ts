import express from 'express';
import {query} from 'express-validator';
import searchController from '../controllers/searchController.js';


const router = express.Router();

router.get('/youtube',
	query('query', 'field is missing').notEmpty(),
	searchController.youtube);

export {
	router as searchRouter
};
