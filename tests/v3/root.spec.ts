import request from 'supertest';
import { app } from '../../src/main';

describe('Test "/v3" route', () => {
  beforeAll(() => {
    delete process.env.DEBUG;
  });

  describe('GET /v3/ping', () => {
    it('should return success response', async () => {
      const res = await request(app).get('/v3/ping');

      expect(res.status).toBe(200);
      expect(res.body.http_status).toEqual(200);
      expect(res.body.message).toEqual('API v3.0.0 is running');
      expect(res.body.success).toEqual(true);
    });
  });
});
