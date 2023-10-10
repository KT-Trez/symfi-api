import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import {before, beforeEach} from 'mocha';
import path from 'path';
import {Musicly_Server} from '../bundle/src/index';
import expectIncorrectBody from './helper/expect/expectIncorrectBody';
import expectIncorrectPath from './helper/expect/expectIncorrectPath';
import expectMusicInCache from './helper/expect/expectMusicInCache';


chai.should();
chai.use(chaiHttp);

const app = Musicly_Server.instance.app;


before(() => {
	Musicly_Server.instance.configure({
		download: {
			useProxy: true
		},
		express: {
			port: 80
		}
	}).start();
});

describe('Test \'content\' endpoint', () => {
	describe('GET /content/youtube', () => {
		const audioIDs = ['dQw4w9WgXcQ', '_6KZI74zKfE', 'ElbwUEJvOP8', '29ryqQIGju4', 'LaQj636PJh0'];

		beforeEach(() => {
			const cacheContent = fs.readdirSync(Musicly_Server.instance.config.cache.path);
			for (const file of cacheContent)
				fs.rmSync(path.join(Musicly_Server.instance.config.cache.path, file));
		});

		it('It should download an audio file', async () => {
			const res = await chai.request(app).get(`/v2/content/youtube/${audioIDs[0]}`);
			res.should.have.status(200);
			expectMusicInCache([audioIDs[0]]);
		}).timeout(5000);

		it('It should download an audio file, multiple times', async () => {
			const requestSong = async () => {
				const res = await chai.request(app).get(`/v2/content/youtube/${audioIDs[0]}`);
				if (res.status !== 200)
					await Promise.reject(`YouTube API responded with status: ${res.status}`);
			};
			
			const requests: Promise<void>[] = [];
			for (let i = 0; i < 5; i++)
				requests.push(requestSong());
			await Promise.all(requests);

			expectMusicInCache([audioIDs[0]]);
		}).timeout(5000);

		it('It should download multiple different audio files at once', async () => {
			const requestSong = async (id: string) => {
				const res = await chai.request(app).get(`/v2/content/youtube/${id}`);
				if (res.status !== 200)
					await Promise.reject(`YouTube API responded with status: ${res.status}`);
			};

			const requests: Promise<void>[] = [];
			for (const audioID of audioIDs)
				requests.push(requestSong(audioID));
			await Promise.all(requests);

			expectMusicInCache(audioIDs);
		}).timeout(120000);

		it('It should return an error about incorrect path', async () => {
			const res = await chai.request(app).get(`/v2/content/youtube/`);
			res.body.messages[0].should.contain('missing');
			expectIncorrectPath(res);
		});

		it('It should return an error about incorrect video id', async () => {
			const res = await chai.request(app).get(`/v2/content/youtube/${encodeURI('INVALID_ID')}`);
			res.body.messages[0].should.contain('no resource');
			expectIncorrectPath(res);
		});
	});

	describe('POST /content/check', () => {
		const invalidIDs = ['INVALID_ID_1', 'INVALID_ID_2'];
		const validIDs = ['dQw4w9WgXcQ', '_6KZI74zKfE'];

		it('It should return a list of valid audio info', async () => {
			const res = await chai.request(app).post(`/v2/content/check`).send([...invalidIDs, ...validIDs]);
			res.should.have.status(200);
			expect(res.body).to.be.an('array').that.is.not.empty;
			expect(res.body).to.have.lengthOf(validIDs.length);
		});

		it('It should return an error about incorrect body', async () => {
			const res = await chai.request(app).post(`/v2/content/check`);
			res.body.messages[0].should.contain('array');
			expectIncorrectBody(res);
		});

		it('It should return an error about empty body', async () => {
			const res = await chai.request(app).post(`/v2/content/check`).send([]);
			res.body.messages[0].should.contain('empty');
			expectIncorrectBody(res);
		});
	});
});
