export type CollectionFormat<T> = {
  has_more: boolean;
  objects: T[];
  page: number;
};

export type NoBody = undefined;

export type NoParams = Record<string, never>;

export type NoQuery = Record<string, never>;
