import { v4 as uuidv4 } from 'uuid';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../models/Customer';
import { NotFoundError, ConflictError } from '../middleware/errorHandler';

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor(customerRepository?: CustomerRepository) {
    this.customerRepository = customerRepository || new CustomerRepository();
  }

  /**
   * Get all customers
   */
  async getAllCustomers(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  /**
   * Get a customer by ID
   */
  async getCustomerById(accountId: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(accountId);
    if (!customer) {
      throw new NotFoundError(`Customer with account ID ${accountId} not found`);
    }
    return customer;
  }

  /**
   * Create a new customer
   */
  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(input.email);
    if (existingCustomer) {
      throw new ConflictError(`Customer with email ${input.email} already exists`);
    }

    const accountId = uuidv4();
    return await this.customerRepository.create({
      ...input,
      account_id: accountId,
    });
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(accountId: string, input: UpdateCustomerInput): Promise<Customer> {
    // Check if customer exists
    const existingCustomer = await this.customerRepository.findById(accountId);
    if (!existingCustomer) {
      throw new NotFoundError(`Customer with account ID ${accountId} not found`);
    }

    // If email is being updated, check for conflicts
    if (input.email && input.email !== existingCustomer.email) {
      const emailConflict = await this.customerRepository.findByEmail(input.email);
      if (emailConflict) {
        throw new ConflictError(`Customer with email ${input.email} already exists`);
      }
    }

    const updatedCustomer = await this.customerRepository.update(accountId, input);
    if (!updatedCustomer) {
      throw new NotFoundError(`Customer with account ID ${accountId} not found`);
    }

    return updatedCustomer;
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(accountId: string): Promise<void> {
    // Check if customer exists
    const existingCustomer = await this.customerRepository.findById(accountId);
    if (!existingCustomer) {
      throw new NotFoundError(`Customer with account ID ${accountId} not found`);
    }

    const deleted = await this.customerRepository.delete(accountId);
    if (!deleted) {
      throw new NotFoundError(`Customer with account ID ${accountId} not found`);
    }
  }
}



