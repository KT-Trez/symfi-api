import {EventEmitter} from 'events';
import {Musicly} from '../typings';
import musicly_lib from './index';


// interfaces
interface StartConfig {
	logLevel?: number;
	maxWorkersCount?: number;
	useLocal?: boolean;
	port: number;
}


// variables
declare const musicly_lib = {
	emitter,
	start,
	stop
};


// functions
declare function start(config: StartConfig): void;

declare function stop(): void;


// exports
export default musicly_lib;
