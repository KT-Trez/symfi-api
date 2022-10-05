import express from 'express';
import {body, param} from 'express-validator';
import syncController from '../controllers/synsController.js';
import SyncService from '../services/SyncService.js';


const router = express.Router();
router.use(express.json());

router.get(['/', '/:uid'],
	// todo: merge into one query
	// todo: correct 'no param' test's helper
	param('uid', 'missing uid').exists(),
	param('uid').custom(uid => {
		if (!SyncService.has(parseInt(uid)))
			throw new Error('incorrect uid');
		return true;
	}),
	syncController.handleGet);

router.post('/',
	// todo: validate body
	body().custom((value, {req}) => {
		if (!req.body.playLists && !req.body.songsList)
			throw new Error('no sync data');
		return true;
	}),
	syncController.handlePost);

export {
	router as syncRouter
};