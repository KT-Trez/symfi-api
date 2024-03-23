# symfi-api

Backend service for the Symfi application.

## Environment Variables

* `DEBUG`: (`true | undefined`) - debug mode, prints additional logs
* `LOG_REQUESTS`: (`true | undefined`)- log all incoming requests
* `NODE_ENV`: (`'test' | undefined`) - environment to run the server in
* `PORT`: (`number | undefined`) - port to run the server on
* `PROXY_DOWNLOAD_ENABLED`: (`true | undefined`) - enable proxy download
* `PROXY_DOWNLOAD_ORIGIN`: (`string | undefined`) - origin to proxy download requests to

## License

Licensed under the [MIT](./LICENSE) License.

## Scripts

* `npm run build` - compiles TypeScript
* `npm run build:watch` - compiles TypeScript and watches for changes
* `npm run lint` - runs linter
* `npm run lint:fix` - runs linter and fixes issues
* `npm run start` - starts the server
* `npm run start:watch` - starts the server and watches for changes
* `npm run test` - runs e2e tests
