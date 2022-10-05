import chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../../src/server.js';
import expectErrorResponse from '../helper/tools/expectErrorResponse.js';


chai.should();
chai.use(chaiHttp);


describe('Test \'download\' endpoint', () => {
	describe('GET /download/youtube', () => {
		it('It should download an audio file', done => {
			const audioID = 'dQw4w9WgXcQ';
			chai.request(app)
				.get('/download/youtube?audioID=' + audioID)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		}).timeout(5000);

		it('It should download audio file multiple times at once', async () => {
			let counter = 0;
			await new Promise<void>(resolve => {
				const audioID = 'dQw4w9WgXcQ';
				for (let i = 0; i < 5; i++)
					chai.request(app)
						.get('/download/youtube?audioID=' + audioID)
						.end((err, res) => {
							res.should.have.status(200);

							counter++;
							if (counter === 5)
								resolve();
						});
			});
		}).timeout(5000);

		it('It should download two audio files at once', async () => {
			let counter = 0;
			await new Promise<void>(resolve => {
				const audioID = 'dQw4w9WgXcQ';
				for (let i = 0; i < 3; i++)
					chai.request(app)
						.get('/download/youtube?audioID=' + audioID)
						.end((err, res) => {
							res.should.have.status(200);

							counter++;
							if (counter === 4)
								resolve();
						});
				const anotherAudioID = '_6KZI74zKfE';
				chai.request(app)
					.get('/download/youtube?audioID=' + anotherAudioID)
					.end((err, res) => {
						res.should.have.status(200);

						counter++;
						if (counter === 4)
							resolve();
					});
			});
		});

		it('It should return error about missing parameters', done => {
			chai.request(app)
				.get('/download/youtube?audioID')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});

		it('It should return error about incorrect id', done => {
			const audioID = 'invalid id';
			chai.request(app)
				.get('/download/youtube?audioID=' + audioID)
				.end((err, res) => {
					expectErrorResponse(res, 500);
					done();
				});
		});
	});
});