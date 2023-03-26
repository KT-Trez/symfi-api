import chai from 'chai';
import chaiHttp from 'chai-http';
import {Musicly_Server} from '../bundle/src/index';
import expectIncorrectQuery from './helper/expect/expectIncorrectQuery';

chai.should();
chai.use(chaiHttp);

const app = Musicly_Server.instance.app;


describe('Test \'search\' endpoint', () => {
	describe('GET /search/youtube', () => {
		const searchQuery = 'music mix summer';

		it('It should get a video list', async () => {
			const res = await chai.request(app).get(`/v2/search/youtube?query=${encodeURI(searchQuery)}`);
			res.should.have.status(200);
			res.body.should.be.a('array').that.is.not.empty;
		});

		it('It should return an error about incorrect query', async () => {
			const res = await chai.request(app).get(`/v2/search/youtube?query`);
			expectIncorrectQuery(res);
		});
	});
});
