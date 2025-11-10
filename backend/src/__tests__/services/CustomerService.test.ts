import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomerService } from '../../services/CustomerService';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { NotFoundError, ConflictError } from '../../middleware/errorHandler';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../../models/Customer';
import { createMockCustomer, createMockCustomerInput } from '../utils/testHelpers';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockRepository: CustomerRepository;

  beforeEach(() => {
    // Create a mock repository
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CustomerRepository;

    service = new CustomerService(mockRepository);
  });

  describe('getAllCustomers', () => {
    it('should return all customers from repository', async () => {
      const mockCustomers = [createMockCustomer(), createMockCustomer()];
      vi.mocked(mockRepository.findAll).mockResolvedValue(mockCustomers);

      const customers = await service.getAllCustomers();

      expect(customers).toEqual(mockCustomers);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when repository returns empty array', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      const customers = await service.getAllCustomers();

      expect(customers).toEqual([]);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      vi.mocked(mockRepository.findAll).mockRejectedValue(error);

      await expect(service.getAllCustomers()).rejects.toThrow('Database error');
    });
  });

  describe('getCustomerById', () => {
    it('should return customer when it exists', async () => {
      const mockCustomer = createMockCustomer();
      vi.mocked(mockRepository.findById).mockResolvedValue(mockCustomer);

      const customer = await service.getCustomerById(mockCustomer.account_id);

      expect(customer).toEqual(mockCustomer);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockCustomer.account_id);
    });

    it('should throw NotFoundError when customer does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.getCustomerById(nonExistentId)).rejects.toThrow(NotFoundError);
      await expect(service.getCustomerById(nonExistentId)).rejects.toThrow(
        `Customer with account ID ${nonExistentId} not found`
      );
    });
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const input = createMockCustomerInput();
      const mockCustomer = createMockCustomer({
        ...input,
        account_id: 'new-id',
      });

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockRepository.create).mockResolvedValue(mockCustomer);

      const customer = await service.createCustomer(input);

      expect(customer).toEqual(mockCustomer);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
        })
      );
    });

    it('should throw ConflictError when email already exists', async () => {
      const input = createMockCustomerInput({ email: 'existing@example.com' });
      const existingCustomer = createMockCustomer({ email: 'existing@example.com' });

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(existingCustomer);

      await expect(service.createCustomer(input)).rejects.toThrow(ConflictError);
      await expect(service.createCustomer(input)).rejects.toThrow(
        `Customer with email ${input.email} already exists`
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should generate a UUID for account_id', async () => {
      const input = createMockCustomerInput();
      const mockCustomer = createMockCustomer();

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockRepository.create).mockResolvedValue(mockCustomer);

      await service.createCustomer(input);

      expect(mockRepository.create).toHaveBeenCalled();
      const createCall = vi.mocked(mockRepository.create).mock.calls[0][0];
      expect(createCall.account_id).toBeDefined();
      expect(typeof createCall.account_id).toBe('string');
      expect(createCall.account_id.length).toBeGreaterThan(0);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const existingCustomer = createMockCustomer();
      const updateInput: UpdateCustomerInput = {
        first_name: 'Updated',
        last_name: 'Name',
      };
      const updatedCustomer = createMockCustomer({
        ...existingCustomer,
        ...updateInput,
      });

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
      vi.mocked(mockRepository.update).mockResolvedValue(updatedCustomer);

      const customer = await service.updateCustomer(existingCustomer.account_id, updateInput);

      expect(customer).toEqual(updatedCustomer);
      expect(mockRepository.findById).toHaveBeenCalledWith(existingCustomer.account_id);
      expect(mockRepository.update).toHaveBeenCalledWith(
        existingCustomer.account_id,
        updateInput
      );
    });

    it('should throw NotFoundError when customer does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      const updateInput: UpdateCustomerInput = { first_name: 'Updated' };

      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(
        service.updateCustomer(nonExistentId, updateInput)
      ).rejects.toThrow(NotFoundError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictError when updating to an existing email', async () => {
      const existingCustomer = createMockCustomer({ email: 'original@example.com' });
      const conflictingCustomer = createMockCustomer({ email: 'conflict@example.com' });
      const updateInput: UpdateCustomerInput = { email: 'conflict@example.com' };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
      vi.mocked(mockRepository.findByEmail).mockResolvedValue(conflictingCustomer);

      await expect(
        service.updateCustomer(existingCustomer.account_id, updateInput)
      ).rejects.toThrow(ConflictError);
      await expect(
        service.updateCustomer(existingCustomer.account_id, updateInput)
      ).rejects.toThrow(`Customer with email ${updateInput.email} already exists`);
    });

    it('should allow updating email to the same email', async () => {
      const existingCustomer = createMockCustomer({ email: 'same@example.com' });
      const updateInput: UpdateCustomerInput = { email: 'same@example.com' };
      const updatedCustomer = createMockCustomer({
        ...existingCustomer,
        email: 'same@example.com',
      });

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
      vi.mocked(mockRepository.update).mockResolvedValue(updatedCustomer);

      const customer = await service.updateCustomer(existingCustomer.account_id, updateInput);

      expect(customer).toEqual(updatedCustomer);
      expect(mockRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when update returns null', async () => {
      const existingCustomer = createMockCustomer();
      const updateInput: UpdateCustomerInput = { first_name: 'Updated' };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
      vi.mocked(mockRepository.update).mockResolvedValue(null);

      await expect(
        service.updateCustomer(existingCustomer.account_id, updateInput)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer successfully', async () => {
      const existingCustomer = createMockCustomer();

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
      vi.mocked(mockRepository.delete).mockResolvedValue(true);

      await service.deleteCustomer(existingCustomer.account_id);

      expect(mockRepository.findById).toHaveBeenCalledWith(existingCustomer.account_id);
      expect(mockRepository.delete).toHaveBeenCalledWith(existingCustomer.account_id);
    });

    it('should throw NotFoundError when customer does not exist', async () => {
      const nonExistentId = 'non-existent-id';

      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.deleteCustomer(nonExistentId)).rejects.toThrow(NotFoundError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when delete returns false', async () => {
      const existingCustomer = createMockCustomer();

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
      vi.mocked(mockRepository.delete).mockResolvedValue(false);

      await expect(service.deleteCustomer(existingCustomer.account_id)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});

