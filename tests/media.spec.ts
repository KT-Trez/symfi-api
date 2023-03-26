import chai from 'chai';
import chaiHttp from 'chai-http';
import {Musicly_Server} from '../bundle/src/index';
import expectIncorrectPath from './helper/expect/expectIncorrectPath';

chai.should();
chai.use(chaiHttp);

const app = Musicly_Server.instance.app;


describe('Test \'media\' endpoint', () => {
	describe('GET /media/youtube', () => {
		const audioIDs = ['dQw4w9WgXcQ', 'INVALID_ID'];

		it('It should get a download link', async () => {
			const res = await chai.request(app).get(`/v2/media/youtube/${audioIDs[0]}`);
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.a.property('link');
		});

		it('It should return an error about incorrect path', async () => {
			const res = await chai.request(app).get(`/v2/media/youtube/`);
			res.body.messages[0].should.contain('missing');
			expectIncorrectPath(res);
		});

		it('It should return an error about incorrect video id', async () => {
			const res = await chai.request(app).get(`/v2/media/youtube/${audioIDs[1]}`);
			res.body.messages[0].should.contain('no resource');
			expectIncorrectPath(res);
		});
	});
});
