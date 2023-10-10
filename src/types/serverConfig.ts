export type ServerConfig = {
  cache: {
    path: string;
  };
  download: {
    useProxy: boolean;
  };
  express: {
    port: number;
  };
  sync: {
    IDLength: number;
    storeTimeoutMS: number;
  };
  workers: {
    maxCount: number;
  };
};
