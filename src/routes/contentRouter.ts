import express from 'express';
import {body, param} from 'express-validator';
import {getVideoInfo} from 'youtube-video-exists';
import contentController from '../controllers/contentController';


const router = express.Router();

router.get(['/youtube', '/youtube/:id'],
	param('id', 'param is missing')
		.exists()
		.bail()
		.custom(async (input, {req}) => {
			const audioID = req.params.id;
			if (!(await getVideoInfo(audioID)).existing)
				throw new Error('no resource with specified id');
			return true;
		}),
	contentController.youtube);

router.use(express.json());

router.post('/check',
	body().custom((input, {req}) => {
		if (!Array.isArray(req.body))
			throw new Error('data should be an array');
		if (req.body.length < 1)
			throw new Error('data payload is empty');
		return true;
	}),
	contentController.check);

export {
	router as contentRouter
};
