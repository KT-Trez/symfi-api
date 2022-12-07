import express from 'express';
import mediaController from '../controllers/mediaController';
import {param} from 'express-validator';


const router = express.Router();

router.get(['/youtube', '/youtube/:id'],
	param('id', 'missing param').exists().isString(),
	mediaController.youtube);

export {
	router as mediaRouter
};
