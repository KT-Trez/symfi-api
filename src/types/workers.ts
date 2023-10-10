export type AudioDownloadWorkerData = {
  videoID: string;
};

export type AudioDownloadParentPort = {
  error?: Error;
  path?: string;
  type: 'end' | 'error';
};
