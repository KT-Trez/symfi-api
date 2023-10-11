import { Stack } from './Stack';

export class FIFO<T> extends Stack<T> {
  constructor(...items: T[]) {
    super(...items);
  }

  public get(): T | undefined {
    return this.store.shift();
  }
}
