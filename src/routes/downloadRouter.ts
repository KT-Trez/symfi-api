import express from 'express';
import {query} from 'express-validator';
import downloadController from '../controllers/downloadController.js';


const router = express.Router();

router.get('/youtube',
	query('audioID', 'missing from query').not().isEmpty(),
	query('audioID', 'audioID must be a string').isString(),
	// todo: !IMPORTANT validate if id exists
	downloadController.youtube);

export {
	router as downloadRouter
};