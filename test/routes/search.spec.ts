import chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../../src/server.js';
import expectErrorResponse from '../tools/expectErrorResponse.js';


chai.should();
chai.use(chaiHttp);


describe('Test \'search\' endpoint', () => {
	describe('GET /search/youtube', () => {
		it('It should get a videos list', done => {
			const keywords = 'dQw4w9WgXcQ';
			chai.request(app)
				.get('/search/youtube?keywords=' + keywords)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array').that.is.not.empty;
					done();
				});
		});

		it('It should return error about missing parameters', done => {
			chai.request(app)
				.get('/search/youtube?keywords')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});
	});
});