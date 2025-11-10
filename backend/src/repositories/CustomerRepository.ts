import { Knex } from 'knex';
import { db } from '../config/database';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../models/Customer';

export class CustomerRepository {
  private database: Knex;

  constructor(database?: Knex) {
    this.database = database || db;
  }

  /**
   * Find all customers
   */
  async findAll(): Promise<Customer[]> {
    const customers = await this.database('customers')
      .select('*')
      .orderBy('date_created', 'desc');
    return customers.map(this.mapToCustomer);
  }

  /**
   * Find a customer by account ID
   */
  async findById(accountId: string): Promise<Customer | null> {
    const customer = await this.database('customers')
      .where('account_id', accountId)
      .first();
    return customer ? this.mapToCustomer(customer) : null;
  }

  /**
   * Find a customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.database('customers')
      .where('email', email)
      .first();
    return customer ? this.mapToCustomer(customer) : null;
  }

  /**
   * Create a new customer
   */
  async create(input: CreateCustomerInput & { account_id: string }): Promise<Customer> {
    const [customer] = await this.database('customers')
      .insert({
        account_id: input.account_id,
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone_number: input.phone_number || null,
        address: input.address || null,
        city: input.city || null,
        state: input.state || null,
        country: input.country || null,
      })
      .returning('*');
    return this.mapToCustomer(customer);
  }

  /**
   * Update an existing customer
   */
  async update(accountId: string, input: UpdateCustomerInput): Promise<Customer | null> {
    const updateData: Partial<Customer> = {};
    
    if (input.first_name !== undefined) updateData.first_name = input.first_name;
    if (input.last_name !== undefined) updateData.last_name = input.last_name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.phone_number !== undefined) updateData.phone_number = input.phone_number || null;
    if (input.address !== undefined) updateData.address = input.address || null;
    if (input.city !== undefined) updateData.city = input.city || null;
    if (input.state !== undefined) updateData.state = input.state || null;
    if (input.country !== undefined) updateData.country = input.country || null;

    const [customer] = await this.database('customers')
      .where('account_id', accountId)
      .update(updateData)
      .returning('*');
    
    return customer ? this.mapToCustomer(customer) : null;
  }

  /**
   * Delete a customer
   */
  async delete(accountId: string): Promise<boolean> {
    const deletedCount = await this.database('customers')
      .where('account_id', accountId)
      .del();
    return deletedCount > 0;
  }

  /**
   * Map database row to Customer model
   */
  private mapToCustomer(row: Record<string, unknown>): Customer {
    return {
      account_id: row.account_id as string,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      email: row.email as string,
      phone_number: row.phone_number as string | null | undefined,
      address: row.address as string | null | undefined,
      city: row.city as string | null | undefined,
      state: row.state as string | null | undefined,
      country: row.country as string | null | undefined,
      date_created: row.date_created as Date,
    };
  }
}

