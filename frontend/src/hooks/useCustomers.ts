import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import { CreateCustomerInput, UpdateCustomerInput } from '../types';

// Query keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: string) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

/**
 * Hook to fetch all customers
 */
export const useCustomers = () => {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => apiService.getAllCustomers(),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useCustomer = (id: string | undefined) => {
  return useQuery({
    queryKey: customerKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Customer ID is required');
      return apiService.getCustomerById(id);
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

/**
 * Hook to create a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCustomerInput) => apiService.createCustomer(input),
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomerInput }) =>
      apiService.updateCustomer(id, input),
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.account_id) });
    },
  });
};

/**
 * Hook to delete a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteCustomer(id),
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};


