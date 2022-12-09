import {Worker} from 'worker_threads';


export default class WorkerService {
	static queue: { msgEventHandler?: (...args: any[]) => void, workerPath: string, workerData?: object }[] = [];
	private static workersCount = 0;

	public static async startQueue() {
		const maxWorkersCount = parseInt(process.env.MAX_WORKER_COUNT);
		if (WorkerService.workersCount < (isNaN(maxWorkersCount) ? 20 : maxWorkersCount)) {
			this.workersCount++;
			await this.pickFromQueue();
		}
	}

	private static async pickFromQueue() {
		const task = WorkerService.queue.shift();
		const worker = new Worker(task.workerPath, {
			workerData: task.workerData
		});

		await new Promise((resolve, reject) => {
			worker
				.on('error', err => {
					reject(err);
				})
				.on('messageerror', err => {
					reject(err);
				})
				.on('exit', code => {
					if (code !== 0)
						reject('worker stopped with exit code: ' + code);
					resolve(true);
				});

			if (task.msgEventHandler)
				worker
					.on('message', task.msgEventHandler);
		});

		this.workersCount--;
		if (this.queue.length !== 0)
			await this.startQueue();
	}
}