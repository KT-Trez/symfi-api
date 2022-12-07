import express from 'express';
import {searchRouter} from './searchRouter';
import {mediaRouter} from './mediaRouter';


const router = express.Router();

router.use('/media', mediaRouter);
router.use('/search', searchRouter);

export {
	router as v2Router
};
