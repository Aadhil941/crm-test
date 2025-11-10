import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  customerKeys,
} from '../../hooks/useCustomers';
import { apiService } from '../../services/apiService';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../../types';
import { mockCustomers, mockCustomer } from '../utils/mocks';

// Mock the apiService
vi.mock('../../services/apiService', () => ({
  apiService: {
    getAllCustomers: vi.fn(),
    getCustomerById: vi.fn(),
    createCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCustomers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCustomers', () => {
    it('should fetch all customers successfully', async () => {
      vi.mocked(apiService.getAllCustomers).mockResolvedValue(mockCustomers);

      const { result } = renderHook(() => useCustomers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCustomers);
      expect(apiService.getAllCustomers).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching customers fails', async () => {
      const error = new Error('Failed to fetch customers');
      vi.mocked(apiService.getAllCustomers).mockRejectedValue(error);

      const { result } = renderHook(() => useCustomers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);
    });

    it('should use correct query key', () => {
      const { result } = renderHook(() => useCustomers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      // Query key should match customerKeys.lists()
      expect(customerKeys.lists()).toEqual(['customers', 'list']);
    });
  });

  describe('useCustomer', () => {
    it('should fetch a single customer by ID', async () => {
      const customerId = mockCustomer.account_id;
      vi.mocked(apiService.getCustomerById).mockResolvedValue(mockCustomer);

      const { result } = renderHook(() => useCustomer(customerId), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCustomer);
      expect(apiService.getCustomerById).toHaveBeenCalledWith(customerId);
    });

    it('should not fetch when ID is undefined', () => {
      const { result } = renderHook(() => useCustomer(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(apiService.getCustomerById).not.toHaveBeenCalled();
    });

    it('should handle error when fetching customer fails', async () => {
      const customerId = mockCustomer.account_id;
      const error = new Error('Customer not found');
      vi.mocked(apiService.getCustomerById).mockRejectedValue(error);

      const { result } = renderHook(() => useCustomer(customerId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);
    });
  });

  describe('useCreateCustomer', () => {
    it('should create a customer successfully', async () => {
      const newCustomer: CreateCustomerInput = {
        first_name: 'New',
        last_name: 'Customer',
        email: 'new@example.com',
      };
      const createdCustomer: Customer = {
        ...mockCustomer,
        ...newCustomer,
      };

      vi.mocked(apiService.createCustomer).mockResolvedValue(createdCustomer);

      const { result } = renderHook(() => useCreateCustomer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newCustomer);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdCustomer);
      expect(apiService.createCustomer).toHaveBeenCalledWith(newCustomer);
    });

    it('should handle error when creating customer fails', async () => {
      const newCustomer: CreateCustomerInput = {
        first_name: 'New',
        last_name: 'Customer',
        email: 'new@example.com',
      };
      const error = { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid email' } };
      vi.mocked(apiService.createCustomer).mockRejectedValue(error);

      const { result } = renderHook(() => useCreateCustomer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newCustomer);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateCustomer', () => {
    it('should update a customer successfully', async () => {
      const customerId = mockCustomer.account_id;
      const updateInput: UpdateCustomerInput = {
        first_name: 'Updated',
      };
      const updatedCustomer: Customer = {
        ...mockCustomer,
        ...updateInput,
      };

      vi.mocked(apiService.updateCustomer).mockResolvedValue(updatedCustomer);

      const { result } = renderHook(() => useUpdateCustomer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: customerId, input: updateInput });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedCustomer);
      expect(apiService.updateCustomer).toHaveBeenCalledWith(customerId, updateInput);
    });

    it('should handle error when updating customer fails', async () => {
      const customerId = mockCustomer.account_id;
      const updateInput: UpdateCustomerInput = {
        email: 'existing@example.com',
      };
      const error = {
        success: false,
        error: { code: 'CONFLICT', message: 'Email already exists' },
      };
      vi.mocked(apiService.updateCustomer).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateCustomer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: customerId, input: updateInput });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteCustomer', () => {
    it('should delete a customer successfully', async () => {
      const customerId = mockCustomer.account_id;
      vi.mocked(apiService.deleteCustomer).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteCustomer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(customerId);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiService.deleteCustomer).toHaveBeenCalledWith(customerId);
    });

    it('should handle error when deleting customer fails', async () => {
      const customerId = mockCustomer.account_id;
      const error = {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Customer not found' },
      };
      vi.mocked(apiService.deleteCustomer).mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteCustomer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(customerId);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('customerKeys', () => {
    it('should have correct structure', () => {
      expect(customerKeys.all).toEqual(['customers']);
      expect(customerKeys.lists()).toEqual(['customers', 'list']);
      expect(customerKeys.list('filter1')).toEqual(['customers', 'list', { filters: 'filter1' }]);
      expect(customerKeys.details()).toEqual(['customers', 'detail']);
      expect(customerKeys.detail('123')).toEqual(['customers', 'detail', '123']);
    });
  });
});

