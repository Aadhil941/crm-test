import { beforeAll, afterAll, beforeEach } from 'vitest';
import {
  getTestDatabase,
  migrateTestDatabase,
  cleanTestDatabase,
  closeTestDatabase,
} from './utils/testDatabase';

/**
 * Global test setup
 * Runs once before all tests
 */
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TEST_DB_NAME = process.env.TEST_DB_NAME || 'customer_accounts_test';

  // Initialize test database
  const testDb = await getTestDatabase();
  await migrateTestDatabase();
  
  // Ensure clean state
  await cleanTestDatabase();
});

/**
 * Global test teardown
 * Runs once after all tests
 */
afterAll(async () => {
  await closeTestDatabase();
});

/**
 * Clean database before each test
 */
beforeEach(async () => {
  await cleanTestDatabase();
});

