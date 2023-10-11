import { Server } from './resources';

export { Server } from './resources/Server';

Server.instance
  .configure({
    express: {
      port: 5000,
    },
  })
  .start();
