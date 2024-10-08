// noinspection JSUnusedGlobalSymbols

declare global {
  // biome-ignore lint/style/noNamespace: it is required to merge interfaces
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: 'true';
      LOG_REQUESTS?: 'true';
      NODE_ENV?: 'test';
      PORT?: string;
      PROXY_DOWNLOAD_ENABLED?: 'true';
      PROXY_DOWNLOAD_ORIGIN?: string;
      PROXY_DOWNLOAD_STREAM_ENDPOINT?: string;

      npm_package_version?: string;
    }
  }
}

export type {};
