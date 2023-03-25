import express from 'express';
import {param} from 'express-validator';
import contentController from '../controllers/contentController';


const router = express.Router();

router.get(['/youtube', '/youtube/:id'],
	// todo: check if id is correct
	param('id', 'missing param').exists().isString(),
	contentController.youtube);

router.use(express.json());

router.post('/check',
	// todo: add body validation
	// body('id', 'missing param').exists().isString(),
	contentController.check);

export {
	router as contentRouter
};
