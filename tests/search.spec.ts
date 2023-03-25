import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from '../src/classes/Server.js';
import expectErrorResponse from './helper/tools/expectErrorResponse.js';

chai.should();
chai.use(chaiHttp);
Server.instance.configure({
	download: {
		useProxy: true
	},
	express: {
		port: 5000
	}
}).start();

const app = Server.instance.app;


describe('Test \'search\' endpoint', () => {
	describe('GET /search/youtube', () => {
		const searchQuery = 'music mix summer';

		it('It should get a video list', done => {
			chai.request(app)
				.get('/search/youtube?query=' + searchQuery)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array').that.is.not.empty;
					done();
				});
		});

		it('It should return an error about missing incorrect query', done => {
			chai.request(app)
				.get('/search/youtube?query')
				.end((err, res) => {
					expectErrorResponse(res, 400);
					done();
				});
		});
	});
});
