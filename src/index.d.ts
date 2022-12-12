import {EventEmitter} from 'events';
import express from 'express';
import {Musicly} from '../typings';
import {Lib} from '../typings/module';
import musicly_lib, {app} from './index';

// variables
declare const lib = {
	emitter,
	start,
	use
};


// functions
declare function start(config: Lib.StartConfig): void;

declare function use(cb: (req: express.Request, res: express.Response) => void): void;


// exports
export default musicly_lib;
