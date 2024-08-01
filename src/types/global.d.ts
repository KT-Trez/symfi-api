// noinspection JSUnusedGlobalSymbols

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: 'true';
      LOG_REQUESTS?: 'true';
      NODE_ENV?: 'test';
      PORT?: string;
      PROXY_DOWNLOAD_ENABLED?: 'true';
      PROXY_DOWNLOAD_ORIGIN?: string;

      npm_package_version?: string;
    }
  }
}

export {};
