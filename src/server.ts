import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import {LogLevel} from '../typings/enums.js';
import {downloadRouter} from './routes/downloadRouter.js';
import {searchRouter} from './routes/searchRouter.js';


const app = express();
const port = process.env.PORT ?? 3000;


app.use(cors());
app.use(express.static('public'))


app.use('/download', downloadRouter);
app.use('/search', searchRouter);

app.use((req, res, next) => {
	if (parseInt(process.env.LOG_LEVEL) >= LogLevel.DEBUG)
		console.debug(`${req.ip} ${req.method} ${req.path}`, new Date());
	next();
});


app.listen(port, () => {
	if (parseInt(process.env.LOG_LEVEL) >= LogLevel.INFO)
		console.info('Server started - :' + port, new Date());
});

export {
	app
}