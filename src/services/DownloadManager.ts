import {Worker} from 'worker_threads';
import Server from '../classes/Server.js';
import FIFO from '../structures/FIFO.js';


type QueueItem = { onMessage?: (...args: any[]) => void, workerPath: string, workerData?: object };

export default class DownloadManager {
	private static _maxWorkersCount: number;

	static get #maxWorkersCount(): number {
		if (!this._maxWorkersCount)
			this._maxWorkersCount = Server.instance.config.workers.maxCount;
		return this._maxWorkersCount;
	}

	static #queue = new FIFO<QueueItem>();
	static #workersCount = 0;

	public static addToQueue(data: object, path: string, onMessage?: (...args: any[]) => void) {
		this.#queue.add({
			onMessage,
			workerData: data,
			workerPath: path
		});

		if (this.#checkThreadAvailability())
			this.nextInQueue();
	}

	static #checkThreadAvailability() {
		return this.#workersCount < this.#maxWorkersCount;
	}

	static #createWorker(task: QueueItem): Promise<boolean> {
		const worker = new Worker(task.workerPath, {
			workerData: task.workerData
		});

		return new Promise((resolve, reject) => {
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

			if (task.onMessage)
				worker
					.on('message', task.onMessage);
		});
	}

	private static async nextInQueue() {
		this.#workersCount++;
		await this.#createWorker(this.#queue.get());
		this.#workersCount--;

		if (this.#queue.size !== 0 && this.#checkThreadAvailability())
			await this.nextInQueue();
	}
}
