# musicly_lib
Library providing a backend service for the musicly app. Can be dockerized or embedded into desktop app with frameworks such as electron.

# How does it work?
musicly_lib is a wrapper for [Express](https://expressjs.com/) server. It allows clients to search for YouTube videos and get an audio download links. In normal mode, download link leads directly to YouTube, but it can be changed to lib's internal endpoint by using `config.download.useProxy: true` in `Musicly_Server` configuration. It's useful in cases, when client device cannot handle YouTube's codecs, as musicly_lib internal server, downloads audio, converts it to `AAC` `.wav` file, and re-streams it to the client.

# API
## Musicly_Server
### use
```typescript
Musicly_Server.use(callback: (req: express.Request, res: express.Response) => void): void;
```

> Passes custom handler to [Express](https://expressjs.com/) server. Must be executed before `Musicly_Server.instance.start()` to take an effect

#### Parameters
* callback: (req: express.Request, res: express.Response) => void - callback that will be passed to [`express.use()`](https://expressjs.com/en/4x/api.html#app.use)

#### Returns
* void

### Example
```typescript
Musicly_Server.use((req: express.Request, res: express.Response) => {
	console.log('New request arrived! Path: ' + req.path);
});
```

## Server
### configure

```typescript
import Server from './Server.js';

Musicly_Server.instance.configure(config: Partial<Lib.Config>): Server;
```

> Changes initial server configuration. Must be executed before `Musicly_Server.instance.start()` to take an effect

#### Parameters
* config: Partial<Lib.Config> - server's config

#### Returns
* [Server](./src/classes/Server.ts) instance

### Example

```typescript
import path from 'path';

const customConfig: Lib.Config = {
	cache: {
		path: path.resolve('custom_cache')
	},
	download: {
		useProxy: true
	},
	express: {
		port: 5000
	},
	sync: { /* currently unused */
		IDLength: 6,
		storeTimeoutMS: 1000 * 60 * 60 * 24
	},
	workers: {
		maxCount: 15
	}
};

Musicly_Server.instance.configure(customConfig);
```

### start

```typescript
Musicly_Server.instance.start(): void;
```

> Loads configuration and custom handlers, then starts [Express](https://expressjs.com/) server

#### Parameters
* none

#### Returns
* void

### Example
```typescript
const server = Musicly_Server.instance;
server.start();
```

# Usage
## Start server
```javascript
Musicly_Server.instance.start();
```

## Start server with custom configuration
```javascript
Musicly_Server.instance
	.configure({
		download: {
            		useProxy: true
		},
		express: {
            		port: 5000
        	}
		/** other options ... **/
    	}).start();
```

## Start server with custom handlers
```javascript
Musicly_Server.use((req: express.Request, res: express.Response) => {
	console.log('New request arrived! Path: ' + req.path);
});

Musicly_Server.use((req: express.Request, res: express.Response) => {
    if (req.method.toLowerCase() === 'get')
	console.log('GET request received');
});

Musicly_Server.instance.start();
```

# License
Licensed under the [MIT](./LICENSE) License.

# Scripts
* `npm run build` - compiles TypeScript files
* `npm run build-watch` - compiles TypeScript files and watches for changes
* `npm run start` - starts app
* `npm run start-watch` - starts app and watches for changes
* `test` - runs provided integration tests
