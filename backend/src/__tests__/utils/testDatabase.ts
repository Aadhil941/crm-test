import { Knex } from 'knex';
import knex from 'knex';
import path from 'path';

// Register ts-node for TypeScript migrations
try {
  require('ts-node/register');
} catch (e) {
  // ts-node should be available in test environment
}

let testDb: Knex | null = null;

/**
 * Create test database if it doesn't exist
 */
async function ensureTestDatabase(): Promise<void> {
  const testDbName = process.env.TEST_DB_NAME || 'customer_accounts_test';
  
  // Connect to postgres database to create test database
  const adminConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: 'postgres', // Connect to default postgres database
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
  };

  const adminDb = knex(adminConfig);
  
  try {
    // Check if database exists
    const result = await adminDb.raw(
      `SELECT 1 FROM pg_database WHERE datname = ?`,
      [testDbName]
    );
    
    if (result.rows.length === 0) {
      // Create database
      await adminDb.raw(`CREATE DATABASE ??`, [testDbName]);
    }
  } catch (error: any) {
    // Database might already exist, ignore error
    if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
      throw error;
    }
  } finally {
    await adminDb.destroy();
  }
}

/**
 * Get or create test database connection
 * Uses a separate test database to avoid conflicts
 */
export async function getTestDatabase(): Promise<Knex> {
  if (testDb) {
    return testDb;
  }

  // Ensure test database exists
  await ensureTestDatabase();

  const testDbName = process.env.TEST_DB_NAME || 'customer_accounts_test';
  const testConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: testDbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: 1,
      max: 5,
    },
    migrations: {
      directory: path.join(__dirname, '../../migrations'),
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  };

  testDb = knex(testConfig);
  return testDb;
}

/**
 * Run migrations on test database
 */
export async function migrateTestDatabase(): Promise<void> {
  const testDb = await getTestDatabase();
  await testDb.migrate.latest();
}

/**
 * Rollback all migrations on test database
 */
export async function rollbackTestDatabase(): Promise<void> {
  const testDb = await getTestDatabase();
  await testDb.migrate.rollback(undefined, true);
}

/**
 * Clean all tables in test database
 */
export async function cleanTestDatabase(): Promise<void> {
  const testDb = await getTestDatabase();
  // Use TRUNCATE for faster cleanup and reset sequences
  try {
    await testDb.raw('TRUNCATE TABLE customers RESTART IDENTITY CASCADE');
  } catch (error) {
    // Fallback to delete if TRUNCATE fails
    await testDb('customers').del();
  }
}

/**
 * Close test database connection
 */
export async function closeTestDatabase(): Promise<void> {
  if (testDb) {
    await testDb.destroy();
    testDb = null;
  }
}

/**
 * Reset test database (rollback and migrate)
 */
export async function resetTestDatabase(): Promise<void> {
  await rollbackTestDatabase();
  await migrateTestDatabase();
  await cleanTestDatabase();
}

