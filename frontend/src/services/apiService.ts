import axios, { AxiosInstance, AxiosError } from 'axios';
import { Customer, CreateCustomerInput, UpdateCustomerInput, ApiResponse, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error status
          return Promise.reject(error.response.data);
        } else if (error.request) {
          // Request made but no response received
          const errorResponse: ApiError = {
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: 'Network error. Please check your connection.',
            },
          };
          return Promise.reject(errorResponse);
        } else {
          // Something else happened
          const errorResponse: ApiError = {
            success: false,
            error: {
              code: 'UNKNOWN_ERROR',
              message: 'An unexpected error occurred',
            },
          };
          return Promise.reject(errorResponse);
        }
      }
    );
  }

  async getAllCustomers(): Promise<Customer[]> {
    const response = await this.client.get<ApiResponse<Customer[]>>('/api/customers');
    return response.data.data;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const response = await this.client.get<ApiResponse<Customer>>(`/api/customers/${id}`);
    return response.data.data;
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const response = await this.client.post<ApiResponse<Customer>>('/api/customers', input);
    return response.data.data;
  }

  async updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const response = await this.client.put<ApiResponse<Customer>>(`/api/customers/${id}`, input);
    return response.data.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.client.delete(`/api/customers/${id}`);
  }
}

export const apiService = new ApiService();

