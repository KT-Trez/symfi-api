import express from 'express';
import {param} from 'express-validator';
import contentController from '../controllers/contentController';


const router = express.Router();

router.get(['/youtube', '/youtube/:id'],
	param('id', 'missing param').not().isEmpty().isString(),
	contentController.youtube);

export {
	router as contentRouter
};
