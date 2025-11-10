import { Customer } from '../../types';

export const mockCustomers: Customer[] = [
  {
    account_id: '123e4567-e89b-12d3-a456-426614174000',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    date_created: new Date('2024-01-01'),
  },
  {
    account_id: '223e4567-e89b-12d3-a456-426614174001',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone_number: '+9876543210',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    date_created: new Date('2024-01-02'),
  },
];

export const mockCustomer: Customer = mockCustomers[0];

export const mockApiResponse = {
  success: true,
  data: mockCustomers,
  count: mockCustomers.length,
};

export const mockErrorResponse = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Customer not found',
  },
};

