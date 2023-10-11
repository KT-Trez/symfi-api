export type ServerConfig = {
  appPort: number;
  cachePath: string;
  downloadThroughProxy: boolean;
  maxWorkers: number;
  sync: {
    IDLength: number;
    storeTimeoutMS: number;
  };
};
