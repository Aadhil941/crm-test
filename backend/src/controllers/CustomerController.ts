import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/CustomerService';
import { CreateCustomerInput, UpdateCustomerInput } from '../models/Customer';

export default class CustomerController {
  private customerService: CustomerService;

  constructor(customerService?: CustomerService) {
    this.customerService = customerService || new CustomerService();
  }

  /**
   * GET /api/customers
   * Get all customers
   */
  getAllCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const customers = await this.customerService.getAllCustomers();
      res.json({
        success: true,
        data: customers,
        count: customers.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/customers/:id
   * Get a customer by ID
   */
  getCustomerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/customers
   * Create a new customer
   */
  createCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input: CreateCustomerInput = req.body;
      const customer = await this.customerService.createCustomer(input);
      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/customers/:id
   * Update an existing customer
   */
  updateCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const input: UpdateCustomerInput = req.body;
      const customer = await this.customerService.updateCustomer(id, input);
      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/customers/:id
   * Delete a customer
   */
  deleteCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.customerService.deleteCustomer(id);
      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}




