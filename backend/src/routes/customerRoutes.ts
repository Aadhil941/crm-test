import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';
import { validate } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();
const customerController = new CustomerController();

// Validation rules
const createCustomerValidation = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('phone_number')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must be less than 100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
];

const updateCustomerValidation = [
  body('first_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('last_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('phone_number')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must be less than 100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
];

// Routes
/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     description: Retrieve a list of all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Successful response with list of customers
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Customer'
 *                     count:
 *                       type: number
 *                       example: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', customerController.getAllCustomers.bind(customerController));

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     description: Retrieve a specific customer by their account ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer account ID
 *         example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Successful response with customer data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: 'NOT_FOUND'
 *                 message: 'Customer not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', customerController.getCustomerById.bind(customerController));

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Create a new customer account with the provided information
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerInput'
 *           example:
 *             first_name: 'John'
 *             last_name: 'Doe'
 *             email: 'john.doe@example.com'
 *             phone_number: '+1234567890'
 *             address: '123 Main St'
 *             city: 'New York'
 *             state: 'NY'
 *             country: 'USA'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Customer'
 *                     message:
 *                       type: string
 *                       example: 'Customer created successfully'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Customer with email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: 'CONFLICT'
 *                 message: 'Customer with this email already exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  validate(createCustomerValidation),
  customerController.createCustomer.bind(customerController)
);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     description: Update an existing customer's information by their account ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer account ID
 *         example: '123e4567-e89b-12d3-a456-426614174000'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCustomerInput'
 *           example:
 *             first_name: 'Jane'
 *             email: 'jane.doe@example.com'
 *             city: 'Los Angeles'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Customer'
 *                     message:
 *                       type: string
 *                       example: 'Customer updated successfully'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: 'NOT_FOUND'
 *                 message: 'Customer not found'
 *       409:
 *         description: Customer with email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: 'CONFLICT'
 *                 message: 'Customer with this email already exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:id',
  validate(updateCustomerValidation),
  customerController.updateCustomer.bind(customerController)
);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     description: Delete a customer account by their account ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer account ID
 *         example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Customer deleted successfully'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: 'NOT_FOUND'
 *                 message: 'Customer not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', customerController.deleteCustomer.bind(customerController));

export default router;


