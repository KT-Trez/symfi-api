import express from 'express';
import {searchRouter} from './searchRouter';
import {mediaRouter} from './mediaRouter';
import {contentRouter} from './contentRouter';


const router = express.Router();

router.use('/content', contentRouter);
router.use('/media', mediaRouter);
router.use('/search', searchRouter);

router.get('/ping', (req, res) => {
	res.status(200).json({success: true});
});

export {
	router as v2Router
};
