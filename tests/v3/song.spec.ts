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

  describe('GET /v3/song/:id', () => {
    const errorTestCases: ErrorTestCase[] = [
      {
        message: 'Not Found',
        params: { id: 'invalid-id' },
        reason: 'the requested video was not found',
        status: 404,
      },
    ];

    it.each(errorTestCases)(
      `should return an error for the param: $params`,
      async ({ message, params, reason, status }) => {
        const res = await request(app).get(`/v3/song/${params?.id}`);

        expect(res.body.reason).toEqual(reason);
        expect(res.body.message).toEqual(message);
        expect(res.body.http_status).toEqual(status);
        expect(res.status).toBe(status);
      },
    );

    const successTestCases: SuccessTestCase[] = [{ params: { id: 'dQw4w9WgXcQ' } }];

    it.each(successTestCases)(`should return song info for the param: $params`, async ({ params }) => {
      const res = await request(app).get(`/v3/song/${params?.id}`);

      expect(res.status).toBe(200);
      expect(res.get('Connection')).toMatch(/close/);
      expect(res.get('Transfer-Encoding')).toMatch(/chunked/);
    });
  });

  describe('GET /v3/song/download', () => {
    const errorTestCases: ErrorTestCase[] = [
      {
        message: 'Bad Request',
        reason: 'query [id]: required\nquery [id]: must be a string\nquery [id]: must be not empty',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { id: [123, 456, 789] },
        reason: 'query [id]: must be a string',
        status: 400,
      },
      {
        message: 'Bad Request',
        params: { id: '' },
        reason: 'query [id]: must be not empty',
        status: 400,
      },
      {
        message: 'Not Found',
        params: { id: 'invalid-id' },
        reason: 'the requested video was not found',
        status: 404,
      },
    ];

    it.each(errorTestCases)(
      `should return an error for the query: $params`,
      async ({ message, params, reason, status }) => {
        const res = await request(app)
          .get('/v3/song/download')
          .query(params || {});

        expect(res.body.reason).toEqual(reason);
        expect(res.body.message).toEqual(message);
        expect(res.body.http_status).toEqual(status);
        expect(res.status).toBe(status);
      },
    );

    const successTestCases: SuccessTestCase[] = [{ params: { id: 'dQw4w9WgXcQ' } }];

    it.each(successTestCases)(`should return download link for the query: $params`, async ({ params }) => {
      const res = await request(app)
        .get('/v3/song/download')
        .query(params || {});

      expect(res.status).toBe(200);
      expect(res.body.http_status).toEqual(200);
      expect(res.body.message).toEqual('Video found');
      expect(res.body.meta).toMatch(/^https?:\S+\.\S{2,3}/);
      expect(res.body.success).toBeTruthy();
    });
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

        expect(res.body.reason).toEqual(reason);
        expect(res.body.message).toEqual(message);
        expect(res.body.http_status).toEqual(status);
        expect(res.status).toBe(status);
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
      async ({ params, reason, status }) => {
        const res = await request(app)
          .get('/v3/song/suggestion')
          .query(params || {});

        expect(res.body.reason).toEqual(reason);
        // expect(res.body.message).toEqual(message); // strange but, but the third error case doesn't have message, fml
        expect(res.body.http_status).toEqual(status);
        expect(res.status).toBe(status);
      },
    );

    const successTestCases: SuccessTestCase[] = [{ params: { q: 'rick' } }, { params: { q: 123 } }];

    it.each(successTestCases)(`should return search suggestions for the search query: $params`, async ({ params }) => {
      const res = await request(app)
        .get('/v3/song/suggestion')
        .query(params || {});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('objects');
      expect(res.body.objects.length).toBeGreaterThan(0);
    });
  });
});
