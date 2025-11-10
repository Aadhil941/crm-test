import { Customer, CreateCustomerInput } from '../../models/Customer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a mock customer data object
 */
export function createMockCustomer(overrides?: Partial<Customer>): Customer {
  return {
    account_id: uuidv4(),
    first_name: 'John',
    last_name: 'Doe',
    email: `john.doe.${Date.now()}@example.com`,
    phone_number: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    date_created: new Date(),
    ...overrides,
  };
}

/**
 * Create mock CreateCustomerInput
 */
export function createMockCustomerInput(
  overrides?: Partial<CreateCustomerInput>
): CreateCustomerInput {
  return {
    first_name: 'Jane',
    last_name: 'Smith',
    email: `jane.smith.${Date.now()}@example.com`,
    phone_number: '+9876543210',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    ...overrides,
  };
}

/**
 * Create multiple mock customers
 */
export function createMockCustomers(count: number): Customer[] {
  return Array.from({ length: count }, (_, i) =>
    createMockCustomer({
      first_name: `Customer${i + 1}`,
      last_name: `Last${i + 1}`,
      email: `customer${i + 1}.${Date.now()}@example.com`,
    })
  );
}

/**
 * Wait for a specified amount of time (useful for async testing)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Assert that a date is recent (within last minute)
 */
export function expectRecentDate(date: Date): void {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  expect(diff).toBeLessThan(60000); // Less than 1 minute
}

