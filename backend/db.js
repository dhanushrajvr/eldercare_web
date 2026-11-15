const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Extract and normalize DATABASE_URL
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/DATABASE_URL\s*=\s*(.*)/);
      if (match) databaseUrl = match[1].trim();
    }
  } catch (err) {
    console.warn('Could not read .env file:', err);
  }
}

// Normalize password quotes if present
if (databaseUrl && databaseUrl.includes("'")) {
  databaseUrl = databaseUrl.replace(/'/g, '');
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
