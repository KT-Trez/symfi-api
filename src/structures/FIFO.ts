import Stack from './Stack.js';

export default class FIFO<T> extends Stack<T> {
	constructor(...items: T[]) {
		super(...items);
	}

	public get(): T {
		return this.store.shift();
	}
}
