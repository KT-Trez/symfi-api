import express from 'express';
import {param} from 'express-validator';
import {getVideoInfo} from 'youtube-video-exists';
import mediaController from '../controllers/mediaController';


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
	mediaController.youtube);

export {
	router as mediaRouter
};
