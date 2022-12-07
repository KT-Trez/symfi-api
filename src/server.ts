import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import {LogLevel} from '../typings/enums.js';
import {v2Router} from './routes/v2';


const app = express();
const port = process.env.PORT ?? 3000;


app.use(cors());
app.use(express.static('public'));


app.use('/v2', v2Router);

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
};
