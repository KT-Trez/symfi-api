import { app, server } from '@app';
import supertest from 'supertest';

describe('test "/v3" router', () => {
  const agent = supertest(app);

  afterAll(() => {
    server.close();
  });

  describe('GET /v3/ping', () => {
    it('should return success response', async () => {
      const res = await agent.get('/v3/ping');

      expect(res.status).toBe(200);
      expect(res.body.http_status).toEqual(200);
      expect(res.body.message).toEqual('API v3.0.0 is running');
      expect(res.body.success).toEqual(true);
    });
  });
});
