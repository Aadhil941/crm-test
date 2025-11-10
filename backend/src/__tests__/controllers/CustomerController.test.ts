import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../utils/testApp';
import { getTestDatabase } from '../utils/testDatabase';
import { createMockCustomer, createMockCustomerInput } from '../utils/testHelpers';

describe('CustomerController API Endpoints', () => {
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

  describe('GET /api/customers', () => {
    it('should return all customers with success response', async () => {
      const baseTime = Date.now();
      const mockCustomer1 = createMockCustomer({ email: `customer1.${baseTime}@example.com` });
      const mockCustomer2 = createMockCustomer({ email: `customer2.${baseTime + 1}@example.com` });
      await testDb('customers').insert([mockCustomer1, mockCustomer2]);

      const response = await request(app).get('/api/customers').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body.data[0]).toMatchObject({
        account_id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      });
    });

    it('should return empty array when no customers exist', async () => {
      const response = await request(app).get('/api/customers').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
        count: 0,
      });
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a customer by ID', async () => {
      const baseTime = Date.now();
      const mockCustomer = createMockCustomer({ email: `customer.${baseTime}@example.com` });
      await testDb('customers').insert(mockCustomer);

      const response = await request(app)
        .get(`/api/customers/${mockCustomer.account_id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.account_id).toBe(mockCustomer.account_id);
      expect(response.body.data.email).toBe(mockCustomer.email);
    });

    it('should return 404 when customer does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .get(`/api/customers/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/customers', () => {
    it('should create a customer successfully', async () => {
      const input = createMockCustomerInput();

      const response = await request(app).post('/api/customers').send(input).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
      });
      expect(response.body.data.account_id).toBeDefined();
      expect(response.body.message).toBe('Customer created successfully');
    });

    it('should return 400 for validation errors - missing required fields', async () => {
      const invalidInput = { first_name: 'John' }; // Missing last_name and email

      const response = await request(app).post('/api/customers').send(invalidInput).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidInput = createMockCustomerInput({ email: 'invalid-email' });

      const response = await request(app).post('/api/customers').send(invalidInput).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      const input = createMockCustomerInput({ email: 'duplicate@example.com' });
      await testDb('customers').insert(createMockCustomer({ email: 'duplicate@example.com' }));

      const response = await request(app).post('/api/customers').send(input).expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CONFLICT');
    });

    it('should accept optional fields', async () => {
      const input = createMockCustomerInput({
        phone_number: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });

      const response = await request(app).post('/api/customers').send(input).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.phone_number).toBe('+1234567890');
      expect(response.body.data.address).toBe('123 Main St');
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update a customer successfully', async () => {
      const existingCustomer = createMockCustomer();
      await testDb('customers').insert(existingCustomer);
      const updateInput = { first_name: 'Updated' };

      const response = await request(app)
        .put(`/api/customers/${existingCustomer.account_id}`)
        .send(updateInput)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.first_name).toBe('Updated');
      expect(response.body.data.last_name).toBe(existingCustomer.last_name);
      expect(response.body.message).toBe('Customer updated successfully');
    });

    it('should return 404 when customer does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updateInput = { first_name: 'Updated' };

      const response = await request(app)
        .put(`/api/customers/${nonExistentId}`)
        .send(updateInput)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 for validation errors', async () => {
      const existingCustomer = createMockCustomer();
      await testDb('customers').insert(existingCustomer);
      const invalidInput = { email: 'invalid-email' };

      const response = await request(app)
        .put(`/api/customers/${existingCustomer.account_id}`)
        .send(invalidInput)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for email conflict', async () => {
      const baseTime = Date.now();
      const existingCustomer = createMockCustomer({ email: `existing.${baseTime}@example.com` });
      const conflictingCustomer = createMockCustomer({ email: `conflict.${baseTime + 1}@example.com` });
      await testDb('customers').insert([existingCustomer, conflictingCustomer]);
      const updateInput = { email: `conflict.${baseTime + 1}@example.com` };

      const response = await request(app)
        .put(`/api/customers/${existingCustomer.account_id}`)
        .send(updateInput)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should delete a customer successfully', async () => {
      const baseTime = Date.now();
      const existingCustomer = createMockCustomer({ email: `delete.${baseTime}@example.com` });
      await testDb('customers').insert(existingCustomer);

      const response = await request(app)
        .delete(`/api/customers/${existingCustomer.account_id}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Customer deleted successfully',
      });

      // Verify customer is deleted
      const checkResponse = await request(app)
        .get(`/api/customers/${existingCustomer.account_id}`)
        .expect(404);
      expect(checkResponse.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 404 when customer does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/api/customers/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});

