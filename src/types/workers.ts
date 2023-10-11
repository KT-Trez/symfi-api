export type AudioDownloadWorkerData = {
  videoID: string;
};

export type AudioDownloadParentPort =
  | {
      error: Error;
      path: undefined;
      type: 'error';
    }
  | {
      error: undefined;
      path: string;
      type: 'end';
    };
