require('dotenv').config();

// Register ts-node for TypeScript migration support
// Use a more robust require that handles different scenarios
let tsNodeRegistered = false;
try {
  // Try to require ts-node/register
  require.resolve('ts-node/register');
  require('ts-node/register');
  tsNodeRegistered = true;
} catch (e) {
  // If ts-node is not available, we'll need to handle migrations differently
  // In production Docker, ts-node should be installed, but if it's not,
  // migrations should be pre-compiled or use a different approach
  if (process.env.NODE_ENV !== 'production') {
    console.warn('ts-node/register not available. TypeScript migrations may not work.');
  }
}

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'customer_accounts',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
  },
};


