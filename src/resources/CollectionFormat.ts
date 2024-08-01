import type { CollectionFormat } from '@types';

const DEFAULT_PAGE = 0;

export class CollectionFormatResource<T> {
  has_more: boolean;
  objects: T[];
  page: number;

  constructor(collection?: Partial<CollectionFormat<T>>) {
    if (!collection) {
      this.has_more = false;
      this.objects = [];
      this.page = DEFAULT_PAGE;
      return;
    }

    const { has_more, objects, page } = collection;

    this.has_more = !!has_more;
    this.objects = objects || [];
    this.page = page || DEFAULT_PAGE;
  }
}
