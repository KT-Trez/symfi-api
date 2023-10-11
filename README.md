# @musicly/server

HTTP server serving `@musicly/app` backend.

## How does it work?

`@musicly/server` is an [express](https://expressjs.com/) server that serves as a backend for `@musicly/app`. \
It allows clients to search for YouTube videos and get an audio download links. In normal mode, download link leads
directly to YouTube, but it can be changed to server's internal endpoint by using `config.download.useProxy: true`
in `Server` configuration. It's useful in cases, when client device cannot handle YouTube's codecs, as
`@musicly/server` internal server, downloads audio, converts it to `AAC` `.wav` file, and re-streams it to the client.

## License

Licensed under the [MIT](./LICENSE) License.

## Scripts

* `npm run build` - compiles TypeScript files
* `npm run dev` - starts Node.js daemon and listens for changes
* `npm run start` - compiles TypeScript and starts the app
* `npm run test` - runs provided integration tests 
