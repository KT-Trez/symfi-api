import express from 'express';
import {param} from 'express-validator';
import contentController from '../controllers/contentController';


const router = express.Router();

router.get(['/youtube', '/youtube/:id'],
	// todo: check if id is correct
	param('id', 'missing param').exists().isString(),
	contentController.youtube);

export {
	router as contentRouter
};
