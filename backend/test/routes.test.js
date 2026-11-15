const { describe, it } = require('node:test');
const assert = require('node:assert');
const { app } = require('../index');

function dispatchRequest(method, url, body = null) {
  return new Promise((resolve) => {
    const req = {
      method,
      url,
      originalUrl: url,
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body
    };

    const res = {
      statusCode: 200,
      _headers: {},
      setHeader(key, val) {
        this._headers[key.toLowerCase()] = val;
      },
      getHeader(key) {
        return this._headers[key.toLowerCase()];
      },
      header(key, val) {
        this._headers[key.toLowerCase()] = val;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        resolve({ status: this.statusCode, headers: this._headers, data });
      },
      send(data) {
        resolve({ status: this.statusCode, headers: this._headers, data });
      },
      sendStatus(code) {
        this.statusCode = code;
        resolve({ status: this.statusCode, headers: this._headers });
      },
      end() {
        resolve({ status: this.statusCode, headers: this._headers });
      }
    };

    app(req, res);
  });
}

describe('ElderCare Backend API Routes (In-Memory)', () => {
  describe('CORS and Preflight Handling', () => {
    it('responds to OPTIONS preflight with HTTP 200 and required CORS headers', async () => {
      const res = await dispatchRequest('OPTIONS', '/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers['access-control-allow-origin'], '*');
      assert.ok(res.headers['access-control-allow-methods'].includes('POST'));
      assert.ok(res.headers['access-control-allow-headers'].includes('Content-Type'));
    });
  });

  describe('GET /api/health', () => {
    it('returns a health payload containing service name and status', async () => {
      const res = await dispatchRequest('GET', '/api/health');
      assert.ok(res.status === 200 || res.status === 500, `Unexpected status: ${res.status}`);
      assert.strictEqual(res.data.service, 'ElderCare API');
      assert.ok(['ok', 'degraded'].includes(res.data.status));
      assert.ok(res.data.timestamp);
    });
  });

  describe('POST /api/login', () => {
    it('rejects an invalid role with HTTP 400', async () => {
      const res = await dispatchRequest('POST', '/api/login', { role: 'administrator' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.strictEqual(res.data.message, 'Invalid role');
    });

    it('rejects an empty request body with HTTP 400', async () => {
      const res = await dispatchRequest('POST', '/api/login', {});
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.strictEqual(res.data.message, 'Invalid role');
    });
  });

  describe('POST /api/patients', () => {
    it('rejects patient creation when name is missing with HTTP 400', async () => {
      const res = await dispatchRequest('POST', '/api/patients', { age: 80 });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.strictEqual(res.data.message, 'Patient name is required');
    });

    it('rejects patient creation when name is only whitespace with HTTP 400', async () => {
      const res = await dispatchRequest('POST', '/api/patients', { name: '   ', age: 80 });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.strictEqual(res.data.message, 'Patient name is required');
    });
  });

  describe('Endpoint Error Handling', () => {
    it('returns 404 for unknown endpoints', async () => {
      const res = await dispatchRequest('GET', '/api/non-existent-endpoint');
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.strictEqual(res.data.message, 'Endpoint not found');
    });
  });
});
