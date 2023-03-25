export default abstract class Stack<T> {
	get size() {
		return this.store.length;
	}

	protected readonly store: T[] = [];

	protected constructor(...items: T[]) {
		this.store = [...items];
	}

	add(...items: T[]) {
		this.store.push(...items);
	}

	delete(cb: (item: T) => boolean) {
		for (let i = 0; i < this.store.length; i++)
			if (cb(this.store[i]))
				this.store.splice(i, 1);
	}

	find(cb: (item: T) => boolean) {
		for (let i = 0; i < this.store.length; i++)
			if (cb(this.store[i]))
				return this.store[i];
	}

	abstract get(): T;
}
