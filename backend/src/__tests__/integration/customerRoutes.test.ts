import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../utils/testApp';
import { getTestDatabase } from '../utils/testDatabase';
import { createMockCustomer, createMockCustomerInput } from '../utils/testHelpers';

describe('Customer Routes Integration Tests', () => {
  let app: ReturnType<typeof createTestApp>;
  let testDb: Awaited<ReturnType<typeof getTestDatabase>>;

  beforeEach(async () => {
    testDb = await getTestDatabase();
    app = createTestApp();
    // Explicitly clean database before each test
    await testDb.raw('TRUNCATE TABLE customers RESTART IDENTITY CASCADE').catch(() => {
      // Fallback if TRUNCATE fails
      return testDb('customers').del();
    });
  });

  describe('Complete CRUD Workflow', () => {
    it('should perform full CRUD operations on a customer', async () => {
      // CREATE
      const input = createMockCustomerInput({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });

      const createResponse = await request(app)
        .post('/api/customers')
        .send(input)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      const createdCustomer = createResponse.body.data;
      expect(createdCustomer.first_name).toBe('John');
      expect(createdCustomer.email).toBe('john.doe@example.com');
      expect(createdCustomer.account_id).toBeDefined();

      const customerId = createdCustomer.account_id;

      // READ - Get by ID
      const getResponse = await request(app).get(`/api/customers/${customerId}`).expect(200);
      expect(getResponse.body.data.account_id).toBe(customerId);

      // READ - Get all
      const getAllResponse = await request(app).get('/api/customers').expect(200);
      expect(getAllResponse.body.data.length).toBeGreaterThan(0);
      expect(
        getAllResponse.body.data.some((c: any) => c.account_id === customerId)
      ).toBe(true);

      // UPDATE
      const updateInput = {
        first_name: 'Jane',
        phone_number: '+9876543210',
        city: 'Los Angeles',
      };

      const updateResponse = await request(app)
        .put(`/api/customers/${customerId}`)
        .send(updateInput)
        .expect(200);

      expect(updateResponse.body.data.first_name).toBe('Jane');
      expect(updateResponse.body.data.phone_number).toBe('+9876543210');
      expect(updateResponse.body.data.city).toBe('Los Angeles');
      expect(updateResponse.body.data.last_name).toBe('Doe'); // Unchanged

      // DELETE
      const deleteResponse = await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);

      // Verify deletion
      await request(app).get(`/api/customers/${customerId}`).expect(404);
    });
  });

  describe('Validation Middleware Integration', () => {
    it('should validate required fields on create', async () => {
      const invalidInput = { first_name: 'John' }; // Missing last_name and email

      const response = await request(app).post('/api/customers').send(invalidInput).expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate email format', async () => {
      const invalidInput = createMockCustomerInput({ email: 'not-an-email' });

      const response = await request(app).post('/api/customers').send(invalidInput).expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate field lengths', async () => {
      const invalidInput = createMockCustomerInput({
        first_name: 'a'.repeat(101), // Exceeds max length
      });

      const response = await request(app).post('/api/customers').send(invalidInput).expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate optional fields on update', async () => {
      const customer = createMockCustomer();
      await testDb('customers').insert(customer);

      const invalidUpdate = { email: 'invalid-email-format' };

      const response = await request(app)
        .put(`/api/customers/${customer.account_id}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Error Scenarios with Real Database', () => {
    it('should handle duplicate email on create', async () => {
      const email = 'duplicate@example.com';
      const existingCustomer = createMockCustomer({ email });
      await testDb('customers').insert(existingCustomer);

      const input = createMockCustomerInput({ email });

      const response = await request(app).post('/api/customers').send(input).expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
      expect(response.body.error.message).toContain(email);
    });

    it('should handle duplicate email on update', async () => {
      const customer1 = createMockCustomer({ email: 'customer1@example.com' });
      const customer2 = createMockCustomer({ email: 'customer2@example.com' });
      await testDb('customers').insert([customer1, customer2]);

      const updateInput = { email: 'customer2@example.com' };

      const response = await request(app)
        .put(`/api/customers/${customer1.account_id}`)
        .send(updateInput)
        .expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
    });

    it('should handle non-existent customer on update', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updateInput = { first_name: 'Updated' };

      const response = await request(app)
        .put(`/api/customers/${nonExistentId}`)
        .send(updateInput)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should handle non-existent customer on delete', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/api/customers/${nonExistentId}`)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      // Create customer
      const input = createMockCustomerInput();
      const createResponse = await request(app)
        .post('/api/customers')
        .send(input)
        .expect(201);
      const customerId = createResponse.body.data.account_id;

      // Update customer
      const updateInput = { first_name: 'UpdatedName' };
      await request(app)
        .put(`/api/customers/${customerId}`)
        .send(updateInput)
        .expect(200);

      // Verify update persisted
      const getResponse = await request(app).get(`/api/customers/${customerId}`).expect(200);
      expect(getResponse.body.data.first_name).toBe('UpdatedName');

      // Verify in list
      const listResponse = await request(app).get('/api/customers').expect(200);
      const customerInList = listResponse.body.data.find(
        (c: any) => c.account_id === customerId
      );
      expect(customerInList.first_name).toBe('UpdatedName');
    });

    it('should handle multiple customers correctly', async () => {
      // Ensure database is clean
      await testDb('customers').del();
      
      const customer1 = createMockCustomerInput({ email: 'customer1@example.com' });
      const customer2 = createMockCustomerInput({ email: 'customer2@example.com' });
      const customer3 = createMockCustomerInput({ email: 'customer3@example.com' });

      await request(app).post('/api/customers').send(customer1).expect(201);
      await request(app).post('/api/customers').send(customer2).expect(201);
      await request(app).post('/api/customers').send(customer3).expect(201);

      const response = await request(app).get('/api/customers').expect(200);
      expect(response.body.data.length).toBe(3);
      expect(response.body.count).toBe(3);
    });
  });
});

