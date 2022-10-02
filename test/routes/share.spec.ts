import chai from 'chai';
import chaiHttp from 'chai-http';
import shareController from '../../src/controllers/shareController.js';
import {app} from '../../src/server.js';
import PlaylistMetadata from '../data-classes/PlaylistMetadata.js';
import SavedAudioMetadata from '../data-classes/SavedAudioMetadata.js';
import expectErrorResponse from '../tools/expectErrorResponse.js';
import expectSuccessResponse from '../tools/expectSuccessResponse.js';


chai.should();
chai.use(chaiHttp);

describe('Test \'share\' endpoint', () => {
	//describe('GET /share/audio', () => {
	//	it('It should get a videos list', done => {
	//		const keywords = 'dQw4w9WgXcQ';
	//		chai.request(app)
	//			.get('/share/youtube?keywords=' + keywords)
	//			.end((err, res) => {
	//				res.should.have.status(200);
	//				res.body.should.be.a('array').that.is.not.empty;
	//				done();
	//			});
	//	});
	//
	//	it('It should return error about missing parameters', done => {
	//		chai.request(app)
	//			.get('/share/youtube?keywords')
	//			.end((err, res) => {
	//				expectErrorResponse(res, 400);
	//				done();
	//			});
	//	});
	//});
	//
	//describe('GET /share/playlists', () => {
	//	it('It should get a videos list', done => {
	//		const keywords = 'dQw4w9WgXcQ';
	//		chai.request(app)
	//			.get('/share/youtube?keywords=' + keywords)
	//			.end((err, res) => {
	//				res.should.have.status(200);
	//				res.body.should.be.a('array').that.is.not.empty;
	//				done();
	//			});
	//	});
	//
	//	it('It should return error about missing parameters', done => {
	//		chai.request(app)
	//			.get('/share/youtube?keywords')
	//			.end((err, res) => {
	//				expectErrorResponse(res, 400);
	//				done();
	//			});
	//	});
	//});

	describe('POST /share/audio', () => {
		it('It should save user\'s audio data', done => {
			chai.request(app)
				.post('/share/audio')
				.send([new SavedAudioMetadata(), new SavedAudioMetadata()])
				.end((err, res) => {
					expectSuccessResponse(res, 200);
					done();
				});
		});

		it('It should return error about missing body', done => {
			chai.request(app)
				.post('/share/audio')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});

		it('It should return error about incorrect body', done => {
			chai.request(app)
				.post('/share/audio')
				.send(new SavedAudioMetadata())
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});

		it('It should return error about missing body\'s params', done => {
			chai.request(app)
				.post('/share/audio')
				.send([new SavedAudioMetadata(), new SavedAudioMetadata().deleteRandomProperties(3)])
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});
	});

	describe('POST /share/playlists', () => {
		it('It should save user\'s playlists', done => {
			chai.request(app)
				.post('/share/playlists')
				.send([new PlaylistMetadata(), new PlaylistMetadata()])
				.end((err, res) => {
					expectSuccessResponse(res, 200);
					done();
				});
		});

		it('It should return error about missing body', done => {
			chai.request(app)
				.post('/share/playlists')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});

		it('It should return error about incorrect body', done => {
			chai.request(app)
				.post('/share/playlists')
				.send(new PlaylistMetadata())
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});

		it('It should return error about missing body\'s params', done => {
			chai.request(app)
				.post('/share/playlists')
				.send([new PlaylistMetadata(), new PlaylistMetadata().deleteRandomProperties(3)])
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});
	});

	describe('DELETE /share/audio', () => {
		const audioID = '0123456789';
		beforeEach(() => {
			shareController.audio.set(audioID, []);
		});

		it('It should delete audio data', done => {
			chai.request(app)
				.delete('/share/audio/' + audioID)
				.end((err, res) => {
					expectSuccessResponse(res, 200);
					done();
				});
		});

		it('It should return error about missing parameters', done => {
			chai.request(app)
				.delete('/share/audio/')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});
	});

	describe('DELETE /share/playlists', () => {
		const playlistID = '0123456789';
		beforeEach(() => {
			shareController.playlists.set(playlistID, []);
		});

		it('It should delete playlists data', done => {
			chai.request(app)
				.delete('/share/playlists/' + playlistID)
				.end((err, res) => {
					expectSuccessResponse(res, 200);
					done();
				});
		});

		it('It should return error about missing parameters', done => {
			chai.request(app)
				.delete('/share/playlists/')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});
	});
});