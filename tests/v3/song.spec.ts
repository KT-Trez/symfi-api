import request from 'supertest';
import { app } from '../../src/main';

type ErrorTestCase = {
  message: string;
  params?: Record<string, unknown>;
  reason: string;
  status: number;
};

describe('Test "/v3/song" route', () => {
  beforeAll(() => {
    delete process.env.DEBUG;
  });

  describe('GET /v3/song', () => {
    const searchParam_search = 'rick';

    it('should return search results', async () => {
      const res = await request(app).get('/v3/song').query({ search: searchParam_search });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('objects');
      expect(res.body.objects.length).toBeGreaterThan(0);
    });

    it('should return search results when "search" query param is a number', async () => {
      const res = await request(app).get('/v3/song').query({ search: 123 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('objects');
      expect(res.body.objects.length).toBeGreaterThan(0);
    });

    const testCases: ErrorTestCase[] = [
      {
        message: 'Bad Request',
        reason: 'query [search]: required\nquery [search]: must be a string\nquery [search]: must be not empty',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { search: [123, 456, 789] },
        reason: 'query [search]: must be a string',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { search: '' },
        reason: 'query [search]: must be not empty',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { page: 'string', search: searchParam_search },
        reason: 'query [page]: optional, must be a number greater than or equal to 0',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { page: '', search: searchParam_search },
        reason: 'query [page]: optional, must be a number greater than or equal to 0',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { page: '-1', search: searchParam_search },
        reason: 'query [page]: optional, must be a number greater than or equal to 0',
        status: 400,
      },
    ];

    it.each(testCases)(
      `should return an error: $params, $message - $reason`,
      async ({ message, params, reason, status }) => {
        const res = await request(app)
          .get('/v3/song')
          .query(params || {});

        expect(res.status).toBe(status);
        expect(res.body.http_status).toEqual(status);
        expect(res.body.message).toEqual(message);
        expect(res.body.reason).toEqual(reason);
      },
    );
  });
});
