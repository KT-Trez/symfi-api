export type CollectionFormat<T> = {
  has_more: boolean;
  objects: T[];
  page: number;
};
