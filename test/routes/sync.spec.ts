import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {afterEach, beforeEach} from 'mocha';
import {app} from '../../src/server.js';
import SyncService from '../../src/services/SyncService.js';
import PlaylistMetadata from '../helper/data-classes/PlaylistMetadata.js';
import SavedAudioMetadata from '../helper/data-classes/SavedAudioMetadata.js';
import expectIncorrectBody from '../helper/expect/expectIncorrectBody.js';
import {expectIncorrectParams} from '../helper/expect/expectIncorrectParams.js';
import expectNoResource from '../helper/expect/expectNoResource.js';
import Random from '../helper/Random.js';
import expectSuccessResponse from '../helper/tools/expectSuccessResponse.js';


chai.should();
chai.use(chaiHttp);

describe('Test \'sync\' endpoint', () => {
	describe('GET /sync', () => {
		const uids: string[] = [];

		afterEach(async () => {
			uids.length = 0;
			SyncService.clear();
		});
		beforeEach(async () => {
			for (let i = 0; i < 3; i++) {
				const data = {
					playLists: [new PlaylistMetadata(), new PlaylistMetadata(), new PlaylistMetadata()],
					songsList: [new SavedAudioMetadata(), new SavedAudioMetadata(), new SavedAudioMetadata()]
				};
				const uid = SyncService.set(data.playLists, data.songsList);
				uids.push(uid);
			}
		});

		it('It should get playLists and songs', async () => {
			const res = await chai.request(app).get('/sync/' + uids[0]);
			expect(res.status).to.eq(200);
			// todo: add array comparison
		});

		it('It should get multiple playLists and songs', async () => {
			for (const uid of uids) {
				const res = await chai.request(app).get('/sync/' + uid);
				expect(res.status).to.eq(200);
				// todo: add array comparison
			}
		});

		it('It should return an error about missing parameters', async () => {
			const res = await chai.request(app).get('/sync');
			expectIncorrectParams(res, 1);
		});

		it('It should return an error about incorrect uid', async () => {
			const res = await chai.request(app).get('/sync/' + Random.getRandomID());
			expectNoResource(res);
		});
	});

	describe('POST /sync', () => {
		afterEach(async () => {
			SyncService.clear();
		});

		it('It should save sent playLists and songs', async () => {
			const data = {
				playLists: [new PlaylistMetadata(), new PlaylistMetadata(), new PlaylistMetadata()],
				songsList: [new SavedAudioMetadata(), new SavedAudioMetadata(), new SavedAudioMetadata()]
			};

			const res = await chai.request(app).post('/sync').send(data);
			res.body.should.have.property('uid').to.match(/\d{6}/);
			expect(SyncService.getSize()).to.be.eq(1);
			expectSuccessResponse(res, 200);
		});

		it('It should return an error about incorrect body', async () => {
			await new Promise(resolve => {
				setTimeout(() => resolve(true), 5000);
			});
		});

		it('It should return an error about empty body', async () => {
			const res = await chai.request(app).post('/sync');
			expectIncorrectBody(res, 1);
		});
	});
});