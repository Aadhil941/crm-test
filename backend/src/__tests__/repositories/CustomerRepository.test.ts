import { describe, it, expect, beforeEach } from 'vitest';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { getTestDatabase } from '../utils/testDatabase';
import { createMockCustomer, createMockCustomerInput, createMockCustomers } from '../utils/testHelpers';
import { v4 as uuidv4 } from 'uuid';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let testDb: Awaited<ReturnType<typeof getTestDatabase>>;

  beforeEach(async () => {
    testDb = await getTestDatabase();
    repository = new CustomerRepository(testDb);
  });

  describe('findAll', () => {
    it('should return empty array when no customers exist', async () => {
      const customers = await repository.findAll();
      expect(customers).toEqual([]);
    });

    it('should return all customers ordered by date_created desc', async () => {
      const baseTime = Date.now();
      const customer1 = createMockCustomer({ 
        email: `customer1.${baseTime}@example.com`,
        date_created: new Date(baseTime),
      });
      const customer2 = createMockCustomer({ 
        email: `customer2.${baseTime + 1}@example.com`,
        date_created: new Date(baseTime + 1),
      });
      const customer3 = createMockCustomer({ 
        email: `customer3.${baseTime + 2}@example.com`,
        date_created: new Date(baseTime + 2),
      });

      // Insert in order
      await testDb('customers').insert(customer1);
      await testDb('customers').insert(customer2);
      await testDb('customers').insert(customer3);

      const customers = await repository.findAll();

      expect(customers).toHaveLength(3);
      // Should be ordered by date_created desc (newest first)
      expect(customers[0].account_id).toBe(customer3.account_id);
      expect(customers[1].account_id).toBe(customer2.account_id);
      expect(customers[2].account_id).toBe(customer1.account_id);
    });

    it('should map database rows to Customer model correctly', async () => {
      const mockCustomer = createMockCustomer();
      await testDb('customers').insert(mockCustomer);

      const customers = await repository.findAll();

      expect(customers).toHaveLength(1);
      const customer = customers[0];
      expect(customer.account_id).toBe(mockCustomer.account_id);
      expect(customer.first_name).toBe(mockCustomer.first_name);
      expect(customer.last_name).toBe(mockCustomer.last_name);
      expect(customer.email).toBe(mockCustomer.email);
      expect(customer.phone_number).toBe(mockCustomer.phone_number);
      expect(customer.address).toBe(mockCustomer.address);
      expect(customer.city).toBe(mockCustomer.city);
      expect(customer.state).toBe(mockCustomer.state);
      expect(customer.country).toBe(mockCustomer.country);
      expect(customer.date_created).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should return null when customer does not exist', async () => {
      const nonExistentId = uuidv4();
      const customer = await repository.findById(nonExistentId);
      expect(customer).toBeNull();
    });

    it('should return customer when it exists', async () => {
      const mockCustomer = createMockCustomer();
      await testDb('customers').insert(mockCustomer);

      const customer = await repository.findById(mockCustomer.account_id);

      expect(customer).not.toBeNull();
      expect(customer?.account_id).toBe(mockCustomer.account_id);
      expect(customer?.email).toBe(mockCustomer.email);
    });
  });

  describe('findByEmail', () => {
    it('should return null when email does not exist', async () => {
      const customer = await repository.findByEmail('nonexistent@example.com');
      expect(customer).toBeNull();
    });

    it('should return customer when email exists', async () => {
      const mockCustomer = createMockCustomer({ email: 'test@example.com' });
      await testDb('customers').insert(mockCustomer);

      const customer = await repository.findByEmail('test@example.com');

      expect(customer).not.toBeNull();
      expect(customer?.email).toBe('test@example.com');
      expect(customer?.account_id).toBe(mockCustomer.account_id);
    });
  });

  describe('create', () => {
    it('should create a customer with all required fields', async () => {
      const input = createMockCustomerInput();
      const accountId = uuidv4();

      const customer = await repository.create({
        ...input,
        account_id: accountId,
      });

      expect(customer.account_id).toBe(accountId);
      expect(customer.first_name).toBe(input.first_name);
      expect(customer.last_name).toBe(input.last_name);
      expect(customer.email).toBe(input.email);
      expect(customer.date_created).toBeInstanceOf(Date);
    });

    it('should create a customer with optional fields', async () => {
      const input = createMockCustomerInput({
        phone_number: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });
      const accountId = uuidv4();

      const customer = await repository.create({
        ...input,
        account_id: accountId,
      });

      expect(customer.phone_number).toBe('+1234567890');
      expect(customer.address).toBe('123 Main St');
      expect(customer.city).toBe('New York');
      expect(customer.state).toBe('NY');
      expect(customer.country).toBe('USA');
    });

    it('should handle null optional fields', async () => {
      const input = createMockCustomerInput({
        phone_number: undefined,
        address: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
      });
      const accountId = uuidv4();

      const customer = await repository.create({
        ...input,
        account_id: accountId,
      });

      expect(customer.phone_number).toBeNull();
      expect(customer.address).toBeNull();
      expect(customer.city).toBeNull();
      expect(customer.state).toBeNull();
      expect(customer.country).toBeNull();
    });
  });

  describe('update', () => {
    it('should return null when customer does not exist', async () => {
      const nonExistentId = uuidv4();
      const updateData = { first_name: 'Updated' };

      const customer = await repository.update(nonExistentId, updateData);

      expect(customer).toBeNull();
    });

    it('should update a single field', async () => {
      const mockCustomer = createMockCustomer();
      await testDb('customers').insert(mockCustomer);

      const updatedCustomer = await repository.update(mockCustomer.account_id, {
        first_name: 'UpdatedName',
      });

      expect(updatedCustomer).not.toBeNull();
      expect(updatedCustomer?.first_name).toBe('UpdatedName');
      expect(updatedCustomer?.last_name).toBe(mockCustomer.last_name); // Unchanged
      expect(updatedCustomer?.email).toBe(mockCustomer.email); // Unchanged
    });

    it('should update multiple fields', async () => {
      const mockCustomer = createMockCustomer();
      await testDb('customers').insert(mockCustomer);

      const updatedCustomer = await repository.update(mockCustomer.account_id, {
        first_name: 'UpdatedFirst',
        last_name: 'UpdatedLast',
        email: 'updated@example.com',
      });

      expect(updatedCustomer).not.toBeNull();
      expect(updatedCustomer?.first_name).toBe('UpdatedFirst');
      expect(updatedCustomer?.last_name).toBe('UpdatedLast');
      expect(updatedCustomer?.email).toBe('updated@example.com');
    });

    it('should update optional fields to null', async () => {
      const mockCustomer = createMockCustomer({
        phone_number: '+1234567890',
        address: '123 Main St',
      });
      await testDb('customers').insert(mockCustomer);

      const updatedCustomer = await repository.update(mockCustomer.account_id, {
        phone_number: '',
        address: '',
      });

      expect(updatedCustomer).not.toBeNull();
      expect(updatedCustomer?.phone_number).toBeNull();
      expect(updatedCustomer?.address).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return false when customer does not exist', async () => {
      const nonExistentId = uuidv4();
      const deleted = await repository.delete(nonExistentId);
      expect(deleted).toBe(false);
    });

    it('should delete an existing customer', async () => {
      const mockCustomer = createMockCustomer();
      await testDb('customers').insert(mockCustomer);

      const deleted = await repository.delete(mockCustomer.account_id);

      expect(deleted).toBe(true);

      // Verify customer is deleted
      const customer = await repository.findById(mockCustomer.account_id);
      expect(customer).toBeNull();
    });

    it('should only delete the specified customer', async () => {
      const baseTime = Date.now();
      const customer1 = createMockCustomer({ email: `customer1.${baseTime}@example.com` });
      const customer2 = createMockCustomer({ email: `customer2.${baseTime + 1}@example.com` });
      await testDb('customers').insert([customer1, customer2]);

      const deleted = await repository.delete(customer1.account_id);

      expect(deleted).toBe(true);

      // Verify only customer1 is deleted
      const found1 = await repository.findById(customer1.account_id);
      const found2 = await repository.findById(customer2.account_id);
      expect(found1).toBeNull();
      expect(found2).not.toBeNull();
    });
  });

  describe('mapToCustomer', () => {
    it('should correctly map database row to Customer model', async () => {
      const mockCustomer = createMockCustomer({
        phone_number: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });
      await testDb('customers').insert(mockCustomer);

      const customer = await repository.findById(mockCustomer.account_id);

      expect(customer).not.toBeNull();
      expect(customer?.account_id).toBe(mockCustomer.account_id);
      expect(customer?.first_name).toBe(mockCustomer.first_name);
      expect(customer?.last_name).toBe(mockCustomer.last_name);
      expect(customer?.email).toBe(mockCustomer.email);
      expect(customer?.phone_number).toBe(mockCustomer.phone_number);
      expect(customer?.address).toBe(mockCustomer.address);
      expect(customer?.city).toBe(mockCustomer.city);
      expect(customer?.state).toBe(mockCustomer.state);
      expect(customer?.country).toBe(mockCustomer.country);
      expect(customer?.date_created).toBeInstanceOf(Date);
    });

    it('should handle null optional fields correctly', async () => {
      const input = createMockCustomerInput({
        phone_number: undefined,
        address: undefined,
      });
      const accountId = uuidv4();
      await repository.create({ ...input, account_id: accountId });

      const customer = await repository.findById(accountId);

      expect(customer).not.toBeNull();
      expect(customer?.phone_number).toBeNull();
      expect(customer?.address).toBeNull();
    });
  });
});

