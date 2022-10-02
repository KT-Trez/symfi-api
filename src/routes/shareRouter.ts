import express from 'express';
import {param, query} from 'express-validator';
import shareController from '../controllers/shareController.js';


const router = express.Router();
router.use(express.json());

router.get('/audio/:id',
	param('id', 'not specified id').not().isEmpty(),
	param('id', 'incorrect id').custom(id => {
		if (!shareController.audio.has(id))
			throw new Error('incorrect id');
		return true;
	}),
	shareController.getAudio);

router.post('/audio',
	shareController.postAudio);

export {
	router as shareRouter
};