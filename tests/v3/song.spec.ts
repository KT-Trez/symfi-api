import request from 'supertest';
import { app } from '../../src/main';

type ErrorTestCase = {
  message: string;
  params?: Record<string, unknown>;
  reason: string;
  status: number;
};

type SuccessTestCase = {
  params?: Record<string, unknown>;
};

describe('Test "/v3/song" route', () => {
  beforeAll(() => {
    delete process.env.DEBUG;
  });

  describe('GET /v3/song/search', () => {
    const errorTestCases: ErrorTestCase[] = [
      {
        message: 'Bad Request',
        reason: 'query [q]: required\nquery [q]: must be a string\nquery [q]: must be not empty',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { q: [123, 456, 789] },
        reason: 'query [q]: must be a string',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { q: '' },
        reason: 'query [q]: must be not empty',
        status: 400,
      },
    ];

    it.each(errorTestCases)(
      `should return an error for the search query: $params`,
      async ({ message, params, reason, status }) => {
        const res = await request(app)
          .get('/v3/song/search')
          .query(params || {});

        expect(res.status).toBe(status);
        expect(res.body.http_status).toEqual(status);
        expect(res.body.message).toEqual(message);
        expect(res.body.reason).toEqual(reason);
      },
    );

    const successTestCases: SuccessTestCase[] = [{ params: { q: 'rick' } }, { params: { q: 123 } }];

    it.each(successTestCases)(`should return search results for the search query: $params`, async ({ params }) => {
      const res = await request(app)
        .get('/v3/song/search')
        .query(params || {});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('objects');
      expect(res.body.objects.length).toBeGreaterThan(0);
    });
  });

  describe('GET /v3/song/suggestions', () => {
    const errorTestCases: ErrorTestCase[] = [
      {
        message: 'Bad Request',
        reason: 'query [q]: required\nquery [q]: must be a string\nquery [q]: must be not empty',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { q: [123, 456, 789] },
        reason: 'query [q]: must be a string',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { q: '' },
        reason: 'query [q]: must be not empty',
        status: 400,
      },
    ];

    it.each(errorTestCases)(
      `should return an error for the search query: $params`,
      async ({ message, params, reason, status }) => {
        const res = await request(app)
          .get('/v3/song/suggestions')
          .query(params || {});

        expect(res.status).toBe(status);
        expect(res.body.http_status).toEqual(status);
        expect(res.body.message).toEqual(message);
        expect(res.body.reason).toEqual(reason);
      },
    );

    const successTestCases: SuccessTestCase[] = [{ params: { q: 'rick' } }, { params: { q: 123 } }];

    it.each(successTestCases)(`should return search suggestions for the search query: $params`, async ({ params }) => {
      const res = await request(app)
        .get('/v3/song/suggestions')
        .query(params || {});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('objects');
      expect(res.body.objects.length).toBeGreaterThan(0);
    });
  });
});
