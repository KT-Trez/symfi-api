import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import {v2Router} from './routes/v2';
import Cache from 'file-system-cache';
import path from 'path';
import Logger, {LogLevel} from './classes/Logger';


const app = express();
const cache = Cache({
	basePath: path.resolve('cache'),
	extension: '.tmp',
	ns: 'media'
});
const port = process.env.PORT ?? 3000;


app.use(cors());
app.use(express.static('public'));

app.use((req, res, next) => {
	Logger.log(req.path, LogLevel.Info);
	next();
});

app.use('/v2', v2Router);

app.listen(port, () => {
	Logger.log('Server started - :' + port, LogLevel.Success);
});

export {
	app,
	cache
};
