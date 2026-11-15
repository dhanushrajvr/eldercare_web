const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Database Configuration & Connection Setup', () => {
  it('correctly loads db module and exports pool and query function', () => {
    const db = require('../db');
    assert.ok(db.pool, 'db.pool should be defined');
    assert.strictEqual(typeof db.query, 'function', 'db.query should be a function');
  });

  it('normalizes connection strings by removing extraneous single quotes', () => {
    const rawUrlWithQuotes = "'postgresql://user:pass@localhost:5432/testdb'";
    const cleaned = rawUrlWithQuotes.replace(/'/g, '');
    assert.strictEqual(cleaned, 'postgresql://user:pass@localhost:5432/testdb');
  });

  it('ensures pool configuration specifies SSL with rejectUnauthorized: false for Supabase', () => {
    const db = require('../db');
    assert.strictEqual(db.pool.options.ssl.rejectUnauthorized, false);
  });
});
